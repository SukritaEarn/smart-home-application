const {InfluxDB, Point} = require('@influxdata/influxdb-client')
var bodyParser  = require('body-parser');
const express = require("express");

const token = '6Q84lBuAiLDTocoGHXTG2zq9JCpwE_nN2BtwlWbkBKViyirKaHHsxwUaRJZAIe582vXNuuUqoTF5S65JrOKHKg=='
const org = 'kasidis.lu@ku.th'
const bucket = "Smart Home"
const client = new InfluxDB({url: 'https://us-central1-1.gcp.cloud2.influxdata.com', token: token})
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const app = express();

const queryApi = client.getQueryApi(org);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors())

function fluxResponse(res, fluxQuery){
  let results=[]
  queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        results.push({measurement: o._measurement, room: o.room, 'device name': o['device name'], [o._field]: o._value, datetime:o._time})
    },
    error(error) {
        res.json({error})
    },
    complete() {
        res.json({status:200, results})
    },
  })
};


app.get("/api/house", (req, res) => {
  
    let { roomName, deviceName } = req.query;
    let fluxQuery=''
    if( !roomName && !deviceName){
      fluxQuery = `from(bucket:"${bucket}") |> range(start: 0)`
    }
    else if (!roomName){
      fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r['device name'] == "${deviceName}")`
    }
    else if(!deviceName){
      fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r.room == "${roomName}")`
    }
    else{
      fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r.room == "${roomName}" and r['device name'] == "${deviceName}")`
    }
    fluxResponse(res,fluxQuery);
});

app.get("/api/house/status", (req, res) => {
    let results =[]
    fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> group(columns: ["device name"]) |> last()`
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
          const o = tableMeta.toObject(row)
          results.push({room: o.room, "device name": o["device name"], status : o.status , datetime:o._time})
      },
      error(error) {
          res.json({error})
      },
      complete() {
          res.json({status:200, results})
      },
    })
    
});

app.post("/api/house/add", (req, res) => {

    var { roomName, deviceName, status, volt} = req.query;
    if (status.toString() === "off"){
      volt = 0
    }
    const writeApi = client.getWriteApi(org, bucket)
    writeApi.useDefaultTags({room: roomName})
    const point1 = new Point('energy consumption')
      .tag('device name', deviceName)
      .tag('status', status)
      .floatField('voltage', volt)
    writeApi.writePoint(point1)
    writeApi
      .close()
      .then(() => {
        console.log('WRITE FINISHED')
        res.json({status:200, success: true})
      })    
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
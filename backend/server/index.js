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
        results.push({
            measurement: o._measurement,
            room: o.room,
            'device name': o['device'], 
            [o._field]: o._value, 
            datetime: o._time,
            status: o.status, 
            on_url: o['on_url'], 
            off_url: o['off_url']})
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
      fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> group(columns: ["device","room"]) |> last()`
    }
    else if (!roomName){
      fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r.device == "${deviceName}") |> group(columns: ["device","room"]) |> last()`
    }
    else if(!deviceName){
      fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r.room == "${roomName}") |> group(columns: ["device","room"]) |> last()`
    }
    else{
      fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r.room == "${roomName}" and r['device'] == "${deviceName}") |> group(columns: ["device","room"]) |> last()`
    }
    fluxResponse(res,fluxQuery);
});

app.get("/api/house/status", (req, res) => {

    fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> group(columns: ["device","room"]) |> last()`
    queryApi.collectRows(fluxQuery).then(
      
      q=>
        {
          q.find( ele=> ele.status === 'on').status = true
          q.find( ele=> ele.status === 'off').status = false
          const reformattedArray = q.map(({ room, device, status}) => ({ [room]: {[device]: status } }));
          const room_=[]
          for(const v of reformattedArray){
              const roomTemp = Object.keys(v)[0]
              if(room_.includes(roomTemp )){
                  const x = reformattedArray.find(obj => Object.keys(obj)[0]=== roomTemp)
                  const y = Object.assign(x[roomTemp], v[roomTemp])
                  x[roomTemp]=y;
                  reformattedArray.pop(v)
              }else{
                  room_.push(roomTemp)
              }
          }
          const arrayToObject = Object.assign({}, ...reformattedArray);
          res.send({rooms:arrayToObject})
        }
      )
    
});

app.post("/api/house/add", (req, res) => {

    var { roomName, deviceName, status, volt, OnURL, OffURL} = req.query;
    if (status.toString() === "off"){
      volt = 0
    }

    fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r.device == "${deviceName}")`
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        if(o['off_url']){
          OnURL = o['on_url']
          OffURL = o['off_url']
        }
      },
      error(error) {
        console.log(error)
      },
      complete() {
        const writeApi = client.getWriteApi(org, bucket)
        writeApi.useDefaultTags({room: roomName})
        const point1 = new Point('energy consumption')
          .tag('device', deviceName)
          .tag('on_url',OnURL)
          .tag('off_url',OffURL)
          .tag('status', status)
          .floatField('voltage', volt)
        writeApi.writePoint(point1)
        writeApi
          .close()
          .then(() => {
            console.log('WRITE FINISHED')
            res.json({status:200, success: true})
          })  
      },
    })

})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
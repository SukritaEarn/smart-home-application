const {InfluxDB, Point} = require('@influxdata/influxdb-client')
var bodyParser  = require('body-parser');
const mysql = require('mysql2/promise');
const express = require("express");
const axios = require('axios')
const token = '6Q84lBuAiLDTocoGHXTG2zq9JCpwE_nN2BtwlWbkBKViyirKaHHsxwUaRJZAIe582vXNuuUqoTF5S65JrOKHKg=='
const org = 'kasidis.lu@ku.th'
const bucket = "Devices"
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
            url: o['url']
          })
    },
    error(error) {
        res.json({error})
    },
    complete() {
        res.json({status:200, results})
    },
  })
};

async function execSQL(subscriber=null, sqlExec){
  const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password : 'pongearnsql',
      database: 'test'
  });
  if(!subscriber){
    await connection.query(sqlExec)
  }else{
    await connection.query(sqlExec, subscriber)
  }
  connection.end()
  console.log('Successfully!');
  return
};

async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);                    

  // hash the message
  const hashBuffer = await require('crypto').subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string                  
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

app.get("/api/house", (req, res) => {
  
    let { roomName, deviceName } = req.body;
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

app.get("/api/history", (req, res) => {
  
  let { roomName, deviceName } = req.body;
  let fluxQuery=''
  if( !roomName && !deviceName){
    fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) `
  }
  else if (!roomName){
    fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r.device == "${deviceName}")`
  }
  else if(!deviceName){
    fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r.room == "${roomName}")`
  }
  else{
    fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r.room == "${roomName}" and r['device'] == "${deviceName}")`
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

app.post("/api/house/add", async (req, res) => {

  var { roomName, deviceName, status, volt, url} = req.body;
  const writeApi = client.getWriteApi(org, bucket)
  writeApi.useDefaultTags({room: roomName})
  const point1 = new Point('energy consumption')
    .tag('id', await sha256(roomName+deviceName))
    .tag('device', deviceName)
    .tag('url', url)
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

app.post("/api/device/command", async (req, res) => {
  var { url, status, deviceName, roomName, volt} = req.body;
  if (status==="off"){
    volt = 0;
  }
  // axios.get(`${url}/cm?cmnd=Power%20${status}`).then((res)=> {console.log(res)})
      const writeApi = client.getWriteApi(org, bucket)
      writeApi.useDefaultTags({room: roomName})
      const point1 = new Point('energy consumption')
        .tag('id', await sha256(roomName+deviceName))
        .tag('device', deviceName)
        .tag('url', url)
        .tag('status', status)
        .floatField('voltage', volt)
      writeApi.writePoint(point1)
      writeApi
        .close()
        .then(() => {
          console.log('WRITE FINISHED')
          res.json({status:200, success: true, context: `${roomName} ${deviceName} is ${status}`})
  })

})

app.post("/api/device/schedule", async (req, res) => {
  var { hours, minutes, deviceName, roomName, date, status, volt, url } = req.body;

  const schedule = {
    deviceName: deviceName,
    room: roomName,
    hours: hours,
    minutes: minutes,
    date: date,
    status: status,
    volt: volt,
    url: url
  }

  execSQL(schedule,'INSERT INTO schedule SET ?')
  res.json(schedule)
})

app.delete("/api/delete/schedule", (req,res) =>{
  var {id} = req.body;
  execSQL( null ,`DELETE FROM schedule WHERE id = ${id}`)
  res.json({status:202, success: true, message: `Schedule's ${id} is deleted`})
})

app.put("/api/update/schedule", (req,res) =>{
  var {id,hours,minutes} = req.body;
  execSQL( null ,`UPDATE schedule SET hours = ${hours}, minutes = ${minutes} WHERE id = ${id}`)
  res.json({status:201, success: true, message: `Schedule's ${id} is updated`})
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
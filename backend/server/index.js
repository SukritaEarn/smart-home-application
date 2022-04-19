const {InfluxDB, Point} = require('@influxdata/influxdb-client')
var bodyParser  = require('body-parser');
const mysql = require('mysql2/promise');
const express = require("express");
const axios = require('axios');
var SHA256 = require("crypto-js/sha256");
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
            device_name: o['device'], 
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
      password : '',
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
              if(room_.includes(roomTemp)){
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

  var { roomName, deviceName, status, watts, url} = req.body;
  var id = SHA256(roomName+deviceName).toString()
  const writeApi = client.getWriteApi(org, bucket)
  writeApi.useDefaultTags({room: roomName})
  const point1 = new Point('energy consumption')
    .tag('id', id)
    .tag('device', deviceName)
    .tag('url', url)
    .tag('status', status)
    .floatField('watts', watts)
  writeApi.writePoint(point1)
  writeApi
    .close()
    .then(() => {
      console.log('WRITE FINISHED')
      res.json({status:200, success: true})
  })
    

})

app.post("/api/device/command", async (req, res) => {
  var {status, deviceName, roomName} = req.body;
  var url,watts;
  var id = SHA256(roomName+deviceName).toString();

  // axios.get(`${url}/cm?cmnd=Power%20${status}`).then((res)=> {console.log(res)})
  // var id = SHA256(roomName+deviceName)
  let fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r.id == "${id}" and r.status == "${status}") |> last()`
  queryApi.queryRows(fluxQuery,  {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      url = o['url']
      watts = o['_value']
    },
    error(error) {
      console.log(error)
    },
    complete() {
      if(status==='off'){
        watts=0
      }
      const writeApi = client.getWriteApi(org, bucket)
      writeApi.useDefaultTags({room: roomName})
      const point1 = new Point('energy consumption')
        .tag('id', id)
        .tag('device', deviceName)
        .tag('url', url)
        .tag('status', status)
        .floatField('watts', watts)
      writeApi.writePoint(point1)
      writeApi
        .close()
        .then(() => {
          console.log('WRITE FINISHED')
          res.json({status:200, success: true, context: `${roomName} ${deviceName} is ${status}`})
        })
    }
  })
})

app.post("/api/device/schedule", async (req, res) => {
  var { hours, minutes, deviceName, roomName, date, status} = req.body;
  var url,watts;
  var id = SHA256(roomName+deviceName).toString()
  let fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r.id == "${id}" and r.status == "${status}") |> last()`
  queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      url = o['url']
      watts = o['_value']
    },
    error(error) {
      console.log(error)
    },
    complete() {
      if(status==='off'){
        watts=0
      }
      const schedule = {
        deviceName: deviceName,
        room: roomName,
        hours: hours,
        minutes: minutes,
        date: date,
        status: status,
        watts: watts,
        url: url
      }
      execSQL(schedule,'INSERT INTO schedule SET ?')
      res.json({status:200, success: true, context: `schedule has been created on ${hours}:${minutes}/${date}`})
    }
  })
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

app.get("/api/device/usage", async (req, res) => {

  const onArray = [];
  const offArray = [];
  let fluxQuery = `from(bucket:"${bucket}") |> range(start: 0)`
  queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      o.status == 'on' ? onArray.push( o) : offArray.push( o);
    },
    error(error) {
      console.log(error)
    },
    complete() {
      let maxLength;
      const usageObj = {
        device: [],
        status: "stop"
      }
      onArray.length > offArray.length ?
        maxLength = onArray.length : maxLength = offArray.length;
      for(let i =0 ;i < maxLength; i++){
        try {
          const hours = Math.abs(Date.parse(onArray[i]['_time']) - Date.parse(offArray[i]['_time']))/ 36e5;
          usageObj.device.push(
            {
              name: onArray[i]['device'],
              room: onArray[i]['room'],
              hours: hours,
              "watts (hrs)": hours * onArray[i]['_value'],
              start: onArray[i]['_time'],
              stop: offArray[i]['_time']
            }
          );
        } catch (error) {
          usageObj.status = 'running'          
        }
      }
      res.json(usageObj)
      return 
    }
  })

})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



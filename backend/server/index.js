const {InfluxDB, Point} = require('@influxdata/influxdb-client')
var bodyParser  = require('body-parser');
const express = require("express");

const token = '6Q84lBuAiLDTocoGHXTG2zq9JCpwE_nN2BtwlWbkBKViyirKaHHsxwUaRJZAIe582vXNuuUqoTF5S65JrOKHKg=='
const org = 'kasidis.lu@ku.th'
const bucket = "kasidis.lu's Bucket"
const client = new InfluxDB({url: 'https://us-central1-1.gcp.cloud2.influxdata.com', token: token})
const PORT = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/api/house", (req, res) => {

    const results = []
    const queryApi = client.getQueryApi(org)
    const fluxQuery = `from(bucket:"kasidis.lu's Bucket") |> range(start: 0) |> filter(fn: (r) => r._measurement == "temperature")`
    queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        // console.log(JSON.stringify(o, null, 2))
        console.log(
            `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
            )
        results.push({measurement: o._measurement, location: o.location, [o._field]: o._value})

    },
    error(error) {
        res.json({status:500, error})
    },
    complete() {
        res.json({status:200, results})
    },
  })
});

// app.post("/api/room", (req, res) => {

//     const { roomName, deviceName, volt } = req.body;
//     const writeApi = client.getWriteApi(org, bucket)
//     writeApi.useDefaultTags({location: roomName})
//     const voltagePoint = new Point('voltage')
//     .tag('Device name', deviceName)
//     .floatField('Value', volt)
//     writeApi.writePoint(voltagePoint)
//     writeApi
//     .close()
//     .then(() => {
//         console.log('WRITE FINISHED')
//         res.json(voltagePoint)
//     })
// })

app.post("/api/room/temperature", (req, res) => {

    const { location, celsius } = req.body;
    const writeApi = client.getWriteApi(org, bucket)
    writeApi.useDefaultTags({location})
    const point1 = new Point('temperature')
    .tag('example', 'index.html')
    .floatField('value', celsius)
    console.log(` ${point1}`)
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
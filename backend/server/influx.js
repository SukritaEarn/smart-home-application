const {InfluxDB, Point} = require('@influxdata/influxdb-client')


// You can generate a Token from the "Tokens Tab" in the UI
const token = '6Q84lBuAiLDTocoGHXTG2zq9JCpwE_nN2BtwlWbkBKViyirKaHHsxwUaRJZAIe582vXNuuUqoTF5S65JrOKHKg=='
const org = 'kasidis.lu@ku.th'
const bucket = "kasidis.lu's Bucket"

const client = new InfluxDB({url: 'https://us-central1-1.gcp.cloud2.influxdata.com', token: token})
const writeApi = client.getWriteApi(org, bucket)

writeApi.useDefaultTags({location: 'browser'})
const point1 = new Point('temperature')
  .tag('example', 'index.html')
  .floatField('value', 27.5)
  const point2 = new Point('volt')
  .tag('example', 'index.html')
  .floatField('value', 30)
console.log(` ${point1},${point2}`)

writeApi.writePoints([point1,point2])

writeApi
  .close()
  .then(() => {
    console.log('WRITE FINISHED')
  })

// const writeApi = client.getWriteApi(org, bucket)
// writeApi.useDefaultTags({host: 'host1'})

// const point = new Point('mem')
//   .floatField('used_percent', 23.43234543)
// writeApi.writePoint(point)
// writeApi
//     .close()
//     .then(() => {
//         console.log('FINISHED')
//     })
//     .catch(e => {
//         console.error(e)
//         console.log('\\nFinished ERROR')
// })

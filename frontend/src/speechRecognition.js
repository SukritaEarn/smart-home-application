const axios = require('axios')

export default function speechRecognition(segment){
    // { "roomName": "kitchen", "deviceName": "light", "status": "off", "volt": 34, "url": "172.xx.xx.xx"}
    let result = segment.entities.map(({ value }) => value.toLowerCase())
    let segLst = segment.intent.intent.split('_');
    if(segLst.length > 1){
        // axios.post('http://localhost:3001/api/device/schedule', data={
        //     "deviceName": result[1],
        //     "roomName": result[2],
        //     "hours": 21,
        //     "minutes": 16,
        //     "date": "everyday",
        //     "status": segLst[1]
        //  })
        console.log(segment)
        return
    }else if(segLst.length === 1){
        console.log('onoff')
        axios.post('http://localhost:3001/api/device/command', {
            roomName: result[0], 
            deviceName: result[1], 
            status: segment.intent.intent
        })
    }
    console.log(segment)
}
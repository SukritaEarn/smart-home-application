const axios = require('axios')

export default function speechRecognition(segment){
    // { "roomName": "kitchen", "deviceName": "light", "status": "off", "volt": 34, "url": "172.xx.xx.xx"}
    let result = segment.entities.map(({ value }) => value)
    let segLst = segment.intent.intent.split('_');

    if(segLst.length > 1){
        // axios.default.post('http://localhost:3001/api/device/schedule', data={
        //     "deviceName": result[1],
        //     "roomName": result[2],
        //     "hours": 21,
        //     "minutes": 16,
        //     "date": "everyday",
        //     "status": "",
        //     "volt": 34,
        //     "url": "172.xx.xx.xx"
        //  })
        console.log('settimer')
    }else{
        console.log('onoff')
        axios.default.post('http://localhost:3001/api/device/schedule', data={
            "roomName": result[1], 
            "deviceName": result[2], 
            "status": segment.intent.intent, 
            "volt": 34, 
            "url": "172.xx.xx.xx"
        })
    }
    console.log(segment)
}
const axios = require('axios')

export default function speechRecognition(segment){
    let result = segment.entities.map(({ value }) => value.toLowerCase())
    let segLst = segment.intent.intent.split('_');
    if(segLst.length === 1){
        axios.post('http://localhost:3001/api/device/command', {
            roomName: result[0], 
            deviceName: result[1], 
            status: segment.intent.intent
        }).then(()=>{
            window.location.reload(false);
        })
    }
}
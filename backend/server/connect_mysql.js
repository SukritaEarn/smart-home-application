const mysql = require('mysql2/promise');
const schedule = require('node-schedule');
const axios = require('axios')

setTimeout(function () {
    process.on("exit", function () {
        require("child_process").spawn(process.argv.shift(), process.argv, {
            cwd: process.cwd(),
            detached : true,
            stdio: "inherit"
        });
    });
    process.exit();
}, 5000);

async function selectQuery(){

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'timerDB',
        password : 'time'
    });
    
    const sqlQuery = 'SELECT * FROM schedule';
    let [rows] = await connection.execute(sqlQuery)
    connection.end()
    rows.forEach( async (data) => {
        const rule = new schedule.RecurrenceRule();
        rule.hour = data.hours;
        rule.minute = data.minutes;
        schedule.scheduleJob(rule, async() => {
            axios.post('http://localhost:3001/api/device/command', data={
               roomName: data.room, deviceName: data.deviceName, status: data.status
            })

            console.log('updated!',data);
        })
    });            
}
selectQuery();

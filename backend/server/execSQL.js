const mysql = require('mysql2/promise');

async function execSQL(){
  const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'test',
      password : '',
  });
  // const sqlQuery = `Create database test`
  // const sqlQuery = `Create TABLE schedule(
  //                       id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  //                       deviceName VARCHAR(30) NOT NULL,
  //                       room VARCHAR(30) NOT NULL,
  //                       hours INT,
  //                       minutes INT,
  //                       date VARCHAR(50),
  //                       status VARCHAR(50),
  //                       volt DECIMAL(19,2),
  //                       url VARCHAR(200)
  //                   )`;
  const sqlQuery = 'SELECT * FROM schedule';
  // const sqlQuery = 'Drop table schedule';
  let [rows] = await connection.execute(sqlQuery)
  console.log(rows)
  connection.end()
  console.log('successfully!');
}
execSQL()
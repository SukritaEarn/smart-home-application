const express = require('express');
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'timerDB',
    password : 'time',
  })

app.get('/init', (req, res) => {
    const sqlQuery =  
        `CREATE TABLE IF NOT EXISTS schedule(
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            deviceName VARCHAR(30) NOT NULL,
            room VARCHAR(30) NOT NULL,
            hours INT,
            minutes INT,
            date VARCHAR(50),
            status VARCHAR(50),
            watts DECIMAL(19,2),
            url VARCHAR(200),
            toggleStatus VARCHAR(50)
        )`;
        db.query(sqlQuery, (err) => {
        if (err) throw err;
        res.send('Table created!')
    });
});

app.get('/get', (req, res) => {
    const SelectQuery = " SELECT * FROM schedule";
    db.query(SelectQuery, (err, result) => {
      res.send(result)
    });
  });

app.post("/add", 
    body('deviceName').not().isEmpty().escape(),
    body('room').not().isEmpty().escape(),
    body('hours').not().isEmpty().escape(),
    body('minutes').not().isEmpty().escape(),
    body('status').not().isEmpty().escape(),
    (req, res) => {
        const errors = validationResult(req);

        if (errors.array().length > 0) {
            res.send(errors.array());
        } else {
            const newDevice = {
                deviceName: req.body.deviceName,
                room: req.body.room,
                hours: req.body.hours,
                minutes: req.body.minutes,
                status: req.body.status,
            };
    
            const sqlQuery = 'INSERT INTO schedule SET ?';
    
            db.query(sqlQuery, newDevice, (err, row) => {
                if (err) throw err;
                res.send('Added new device successfully!');
            });
        }
    // const bookName = req.body.setBookName;
    // const bookReview = req.body.setReview;
    // const deviceName = "TV";
    // const room = "Bedroom";
    // const hours = 9
    // const minutes = 30
    // const status = "on"
    // const InsertQuery = "INSERT INTO schedule (deviceName, room, hours, minutes, status) VALUES (?,?,?,?,?)";
    // db.query(InsertQuery, [deviceName, room, hours, minutes, status], (err, result) => {
    //   console.log(result)
    // });
  });

// app.delete("/delete/:bookId", (req, res) => {
//     const bookId = req.params.bookId;
//     const DeleteQuery = "DELETE FROM books_reviews WHERE id = ?";
//     db.query(DeleteQuery, bookId, (err, result) => {
//       if (err) console.log(err);
//     })
//   })

// app.put("/update/:bookId", (req, res) => {
//     const bookReview = req.body.reviewUpdate;
//     const bookId = req.params.bookId;
//     const UpdateQuery = "UPDATE books_reviews SET book_review = ? WHERE id = ?";
//     db.query(UpdateQuery, [bookReview, bookId], (err, result) => {
//       if (err) console.log(err)
//     })
//   })

app.listen('3003', () => { })

const mysql = require('mysql2');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'ic2',
    password: ''
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to Authentication database!");
});

module.exports = con


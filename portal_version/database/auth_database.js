const mysql = require('mysql2');
const con = mysql.createConnection({
    host: '172.17.0.3',
    user: 'root',
    database: 'ic2',
    password: 'password',
    port: '3306'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to Authentication database!");
});

module.exports = con


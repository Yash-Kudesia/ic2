const mysql = require('mysql2');
const con = mysql.createConnection({
    host: process.env.npm_config_authDB || 'localhost',
    user: 'root',
    database: 'ic2',
    password: 'password',
    port:3306
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to Authentication database!");
});

module.exports = con


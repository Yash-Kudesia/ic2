const mysql = require('mysql2');
const config = require('../config')

const con = mysql.createConnection({
    host:config.AUTH_DB_HOST,
    user: config.AUTH_DB_USER,
    database: config.AUTH_DB_NAME,
    password: config.AUTH_DB_PASS
    //port:config.AUTH_DB_PORT
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to Authentication database!");
});

module.exports = con


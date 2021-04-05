const mysql = require('mysql2');
var config = require('../config')

const doctor = mysql.createConnection({
    host: config.DOCTOR_DB_HOST,
    user: config.DOCTOR_DB_USER,
    database: config.DOCTOR_DB_NAME,
    password: config.DOCTOR_DB_PASS
    //port:config.DOCTOR_DB_PORT
});

doctor.connect(function (err) {
    if (err) throw err;
    console.log("Connected to doctor database!");
});

module.exports = doctor


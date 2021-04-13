const mysql = require('mysql2');
const config = require('../config')
var color = require("../status_color")
const doctor = mysql.createConnection({
    host: config.DOCTOR_DB_HOST,
    user: config.DOCTOR_DB_USER,
    database: config.DOCTOR_DB_NAME,
    password: config.DOCTOR_DB_PASS
    //port:config.DOCTOR_DB_PORT
});

doctor.connect(function (err) {
    if (err){
        console.error(color.FgRed,"ERROR : "+err)
    }else{
        console.info(color.FgGreen,`INFO : Connected to ${config.DOCTOR_NAME} Database!`);
    }
});
module.exports = doctor


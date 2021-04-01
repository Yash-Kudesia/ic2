const mysql = require('mysql2');
const doctor = mysql.createConnection({
    host: process.env.npm_config_docDB || 'localhost',
    user: 'root',
    database: 'ic2_doctor',
    password: 'password',
    port:'3306'
});

doctor.connect(function (err) {
    if (err) throw err;
    console.log("Connected to doctor database!");
});

module.exports = doctor


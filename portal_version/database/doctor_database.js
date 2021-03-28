const mysql = require('mysql2');
const doctor = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'ic2_doctor',
    password: ''
});

doctor.connect(function (err) {
    if (err) throw err;
    console.log("Connected to doctor database!");
});

module.exports = doctor


const mysql = require('mysql2');
const connect  = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'ic2_doctor',
    password : ''
});
connect.connect();
module.exports = connect
const mysql = require('mysql2');
const connect  = mysql.createConnection({
    host : '172.17.0.3',
    user : 'root',
    database : 'ic2_doctor',
    password : 'password',
    port:'3306'
});
connect.connect();
module.exports = connect
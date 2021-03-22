const mysql = require('mysql2');
const connect  = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'ic2',
    password : ''
});
connect.connect();
module.exports = connect
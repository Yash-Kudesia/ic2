const mysql = require('mysql2');

const service  = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'db1',
    password : ''
});

service.connect();
module.exports =service
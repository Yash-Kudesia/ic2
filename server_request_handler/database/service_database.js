const mysql = require('mysql2');

const service  = mysql.createConnection({
    host : '172.17.0.3',
    user : 'root',
    database : 'db1',
    password: 'password',
    port:'3306'
});

service.connect();
module.exports =service
const mysql = require('mysql2');

const service  = mysql.createConnection({
    host: process.env.npm_config_serviceDB || 'localhost',
    user : 'root',
    database : 'db1',
    password: '',
});

service.connect();
module.exports =service
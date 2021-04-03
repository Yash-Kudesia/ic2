const mysql = require('mysql2');

const serviceDB  = mysql.createConnection({
    host: process.env.npm_config_serviceDB || 'localhost',
    user : 'root',
    database : 'db1',
    password : '',
});
serviceDB.connect();
module.exports = {serviceDB}
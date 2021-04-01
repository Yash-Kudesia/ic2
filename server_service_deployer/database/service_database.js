const mysql = require('mysql2');

const serviceDB  = mysql.createConnection({
    host: process.env.npm_config_serviceDB || 'localhost',
    user : 'root',
    database : 'db1',
    password : 'password',
    port:'3306'
});
serviceDB.connect();
module.exports = {serviceDB}
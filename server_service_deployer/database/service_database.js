const mysql = require('mysql2');
var config = require('../config')

const service  = mysql.createConnection({
    host: config.SERVICE_DB_HOST,
    user : config.SERVICE_DB_USER,
    database :config.SERVICE_DB_NAME,
    password: config.SERVICE_DB_PASS
    //port:config.SERVICE_DB_PORT
});

service.connect();
module.exports =service
const mysql = require('mysql2');
var config = require('../config')

const service  = mysql.createConnection({
    host: config.SERVICE_DB_HOST,
    user : config.SERVICE_DB_USER,
    database :config.SERVICE_DB_NAME,
    password: config.SERVICE_DB_PASS,
    port:config.SERVICE_DB_PORT
});

service.connect(function (err) {
    if (err){
        console.error("ERROR : "+err)
    }else{
        console.info(`INFO : Connected to ${config.SERVICE_DB_NAME} Database!`);
    }
});
module.exports =service
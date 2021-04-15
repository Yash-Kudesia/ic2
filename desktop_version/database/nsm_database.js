const mysql = require('mysql2');
var config = require('../config')

const nsm  = mysql.createConnection({
    host : config.NSM_DB_HOST,
    user : config.NSM_DB_USER,
    database : config.NSM_DB_NAME,
    password : config.NSM_DB_PASS,
    port: config.NSM_DB_PORT
});
nsm.connect(function (err) {
    if (err){
        console.error("ERROR : "+err)
    }else{
        console.info(`INFO : Connected to ${config.NSM_DB_NAME} Database!`);
    }
});
module.exports = nsm
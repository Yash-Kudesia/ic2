const mysql = require('mysql2');
const config = require('./config')

const connect  = mysql.createConnection({
    host : config.DOCTOR_DB_HOST,
    user :config.DOCTOR_DB_USER,
    database : config.DOCTOR_DB_NAME,
    password : config.DOCTOR_DB_PASS
    // port:config.DOCTOR_DB_PORT
});
connect.connect(function (err) {
    if (err){
        console.error("ERROR : "+err)
    }else{
        console.info(`INFO : Connected to ${config.DOCTOR_NAME} Database!`);
    }
});

module.exports = connect
const mysql = require('mysql2');

const nsm  = mysql.createConnection({
    host: process.env.npm_config_nsmDB || 'localhost',
    user : 'root',
    database : 'nsm',
    password : '',
});
nsm.connect()
module.exports = nsm
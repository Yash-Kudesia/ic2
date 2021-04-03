const mysql = require('mysql2');
const connect  = mysql.createConnection({
    host : process.env.npm_config_docDB || 'localhost',
    user : 'root',
    database : 'ic2_doctor',
    password : 'password',
    port:3306
});
connect.connect();
module.exports = connect
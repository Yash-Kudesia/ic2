const mysql = require('mysql2');
const connect  = mysql.createConnection({
    host : process.env.npm_config_authDB || 'localhost',
    user : 'root',
    database : 'ic2',
    password : ''
});
connect.connect();
module.exports = connect
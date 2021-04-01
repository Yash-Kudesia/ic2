const mysql = require('mysql2');

const nsm  = mysql.createConnection({
    host : '172.17.0.3',
    user : 'root',
    database : 'nsm',
    password: 'password',
    port:'3306'
});

module.exports = nsm
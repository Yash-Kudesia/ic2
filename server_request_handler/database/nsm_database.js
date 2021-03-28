const mysql = require('mysql2');

const nsm  = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'nsm',
    password : ''
});

module.exports = nsm
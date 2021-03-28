const mysql = require('mysql2');
const nsm  = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'nsm',
    password : ''
});
const db1  = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'db1',
    password : ''
});
nsm.connect();
db1.connect();
module.exports = {nsm,db1}
const mysql = require('mysql2');
const nsm  = mysql.createConnection({
    host : '172.17.0.3',
    user : 'root',
    database : 'nsm',
    password : 'password',
    port:'3306'
});
const db1  = mysql.createConnection({
    host : '172.17.0.3',
    user : 'root',
    database : 'db1',
    password : 'password',
    port:'3306'
});
nsm.connect();
db1.connect();
module.exports = {nsm,db1}
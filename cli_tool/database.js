const mysql = require('mysql2');
const db  = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'nsm',
    password : ''
});
db.connect()

module.exports = db

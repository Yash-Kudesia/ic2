const mysql = require('mysql2');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'ic2',
    password: ''
});
// const doctor = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'ic2_doctor',
//     password: ''
// });
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to Authentication database!");
});
// doctor.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
// });

module.exports = con


// const ic2 = mysql.createPool({
//     connectionLimit : 10,
//     host            : 'localhost',
//     user            : 'root',
//     password        : '',
//     database        : 'ic2'
//   });

//   const doctor = mysql.createPool({
//     connectionLimit : 10,
//     host            : 'localhost',
//     user            : 'root',
//     password        : '',
//     database        : 'ic2_doctor'
//   });
  
//   module.export = {
//     getConnection: (callback) => {
//       return ic2.getConnection(callback);
//     } ,getConnection: (callback) => {
//         return doctor.getConnection(callback);
//       } 
//   }




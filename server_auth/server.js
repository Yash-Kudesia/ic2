const express = require('express');
// const monitor = require("express-status-monitor")

const appAuth = express();
const db = require("./database/auth_database.js");
const { encrypt, decrypt } = require('./crypto');
const { doctor, doctorAPI } = require('./doctor')

var config = require('./config')
const port = config.AUTH_PORT;
const IP = config.AUTH_IP
process.env.SYSTEMENV=0;

// var options = {
//     title: `${config.AUTH_NAME} Status`,
//     path: '/status',
//     healthChecks: [{
//         protocol: 'http',
//         host: config.DOCTOR_IP,
//         path: '/status',
//         port: config.DOCTOR_PORT
//       }]
// }

// appAuth.use(monitor(options))

appAuth.use(
    express.urlencoded({
        extended: true
    })
)

appAuth.use(express.json())

function authenticate(req, res,password) {
    return new Promise((resolve,reject)=>{
        db.query('SELECT * from token WHERE Username = ?', [req.user], function (err, row, fields) {
            if (err) {
                console.log(`ERROR : ${err}`)
                reject(err)
            }
            else {
                console.info("INFO : Credentials from Request "+req.user+"  ,"+password)
                if(row.length>0){
                    var u = row[0].Username;
                    var p = row[0].Pasword;
                    if (req.user == u && password == p) {
                        res.send("True")
                        resolve("True")
                    } else {
                        res.send("False")
                        reject(err)
                    }
                }else{
                    res.send("False")
                    reject(err)
                    console.log("ERROR : No such user found "+req.user)
                }
            }
        });
    })

}

function verifyCredentials(token,json_req,password,res){
    doctorAPI(token, json_req.source,json_req,res,password,authenticate).catch((err)=>{
        console.error(`ERROR : ${err}`)
        res.send("False")
    })

}

appAuth.get('/status',(req,res)=>{
    res.send(200)
})

// home route
appAuth.post('/', (req, res) => {
    var json_req = req.body
    console.info("INFO : Request received at Auth API")
    console.info(`INFO : Request param received -- ${Object.getOwnPropertyNames(req.body)}`)
    var token = {
        iv: json_req.doctor1,
        content: json_req.doctor2
    }
    var password = {
        iv: json_req.auth1,
        content: json_req.auth2
    }
    var password = decrypt(password)
    verifyCredentials(token,json_req,password,res)
})

appAuth.listen(port,IP,err => {
    if (err) throw err;
    console.info(`INFO : ${config.AUTH_NAME} Server listening on http://${IP}:${port}`);
  })
//npm start --authDB=192.168.1.1
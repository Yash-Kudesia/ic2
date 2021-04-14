const express = require('express');
const app = express();
const db = require("./database/auth_database.js");
const { encrypt, decrypt } = require('./crypto');
const { doctor, doctorAPI } = require('./doctor')

var config = require('./config')
const port = config.AUTH_PORT;
const IP = config.AUTH_IP
process.env.SYSTEMENV=0;
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

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

// home route
app.post('/', (req, res) => {
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

app.listen(port,IP,err => {
    if (err) throw err;
    console.info(`INFO : ${config.AUTH_NAME} Server listening on http://${IP}:${port}`);
  })
//npm start --authDB=192.168.1.1
const express = require('express');
const app = express();
const db = require("./database/auth_database.js");
const { encrypt, decrypt } = require('./crypto');
const { doctor, doctorAPI } = require('./doctor')

var config = require('./config')
const port = config.AUTH_PORT;
const IP = config.AUTH_IP
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

function authenticate(req, res,password) {

    db.query('SELECT * from token WHERE Username = ?', [req.user], function (err, row, fields) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(row);
            var u = row[0].Username;
            var p = row[0].Pasword;
            console.info("INFO : Credentials from Request "+req.user+"  ,"+password)
            console.INFO
            if (req.user == u && password == p) {
                res.send("True")
            } else {
                res.send("False")
            }
        }
    });
}

function verifyCredentials(token,json_req,password,res){
    doctorAPI(token, json_req.source,authenticate,json_req,res,password)

}

// home route
app.post('/', (req, res) => {
    var json_req = req.body
    console.info("INFO : Request received at Auth API")
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
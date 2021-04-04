const express = require('express');
var querystring = require('querystring');
const app = express();
const db = require("./database.js");
const { encrypt, decrypt } = require('./crypto');
const { json } = require('express');
const config = require('./config')
const port = config.DOCTOR_PORT;
const IP = config.DOCTOR_IP;


app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

function authenticate(tablename, destination, token, res) {
    var sql = `Select * from ${tablename} where Token = ? and Dest = ?`
    console.log("SQL in doctor : "+sql)
    console.log("Descrypted token at doctor " + token)
    db.query(sql, [token,destination],function (err, row, fields) {
        if (err) {
            console.log(err)
            res.send("false")
        }
        if (row.length > 0) {
            res.send("true")
        }else{
            res.send("false")
            console.log("found nothing in DB")
        }
    });
    //res.send("false")
}

function fileTransferCheck(src,dest, ID, hash, res) {
    var sql = `Select * from fileTransfer where serviceID = ? and src = ? and dest=? and hash=?`
    db.query(sql, [ID,src,dest,hash],function (err, row, fields) {
        if (err) {
            console.log(err)
            res.send("false")
        }
        if (row.length > 0) {
            res.send("true")
        }else{
            res.send("false")
            console.log("found nothing in DB")
        }
    });
}

// home route
app.post('/', (req, res) => {
    var json_req = req.body
    console.log("Request received at doctor")
    if (json_req.type=="data"){
        console.log("Request on doctor is of type : Data")
        var token = {
            iv: json_req.doctor1,
            content: json_req.doctor2
        }
        var token = decrypt(token)
        authenticate(json_req.source, json_req.dest, token, res)
    }else{
        console.log("Request on doctor is of type : File")
        var ID = json_req.serviceID
        fileTransferCheck(json_req.source,json_req.dest,ID,json_req.hash,res)
    }
    
})
app.listen(port,IP,err => {
    if (err) throw err;
    console.log(`Doctor Server listening on http://${IP}:${port}`);
  })

//npm start --docDB=192.168.1.1
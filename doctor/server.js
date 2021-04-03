const express = require('express');
var querystring = require('querystring');
const app = express();
const db = require("./database.js");
const { encrypt, decrypt } = require('./crypto');
const { json } = require('express');

const port = process.env.PORT || 8080;



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
        var token = {
            iv: json_req.doctor1,
            content: json_req.doctor2
        }
        var token = decrypt(token)
        authenticate(json_req.source, json_req.dest, token, res)
    }else{
        var ID = json_req.serviceID
        fileTransferCheck(json_req.source,json_req.dest,ID,json_req.hash,res)
    }
    
})


app.listen(port, ()=>{ console.log(`Doctor listening on http://localhost:${port}`)});
//npm start --docDB=192.168.1.1
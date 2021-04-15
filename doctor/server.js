const express = require('express');
// const monitor = require("express-status-monitor")

var querystring = require('querystring');
const app = express();
const db = require("./database.js");
const { encrypt, decrypt } = require('./crypto');
const { json } = require('express');
const config = require('./config')
const port = config.DOCTOR_PORT;
const IP = config.DOCTOR_IP;
process.env.SYSTEMENV=0;

// var options = {
//     title: `${config.DOCTOR_NAME} Status`,
//     path: '/status',
//     healthChecks: [{
//         protocol: 'http',
//         host: config.S1_IP,
//         path: '/status',
//         port: config.S1_PORT
//       },{
//         protocol: 'http',
//         host: config.S2_IP,
//         path: '/status',
//         port: config.S2_PORT
//       },
//       {
//         protocol: 'http',
//         host: config.S3_IP,
//         path: '/status',
//         port: config.S3_PORT
//       },
//       {
//         protocol: 'http',
//         host: config.AUTH_IP,
//         path: '/status',
//         port: config.AUTH_PORT
//       }]
// }

// app.use(monitor(options))

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

function authenticate(tablename, destination, token, res) {
    try {
        var sql = `Select * from ${tablename} where Token = ? and Dest = ?`
        db.query(sql, [token, destination], function (err, row, fields) {
            if (err) {
                console.error(`ERROR : ${err}`)
                res.send("false")
            }
            if (row.length > 0) {
                console.info(`INFO : Data request verified with source ${tablename} and destination ${destination}`)
                res.send("true")
            } else {
                res.send("false")
                console.error(`ERROR : Data Request Token ${token} Not Found`)
            }
        });
    } catch (err) {
        console.error(`ERROR : ${err}`)
    }
}
function check(){
    var sql = "Select * from filetransfer"
    db.query(sql, function (err, row, fields) {
        if (err) {
            console.error(`ERROR : ${err}`)
            res.send("false")
        }
        if (row.length > 0) {
            console.info(`INFO : Testing data : ${row}`)
        }
            
    });
}
function fileTransferCheck(src, dest, ID, hash, res) {
    try {
        
        var sql = `Select * from filetransfer where src = ? and dest=? and hash=?`
        console.info(`INFO : SQL for file ${sql}`)
        console.info(`INFO : Param : ${src}, ${dest} and ${hash}`)
        db.query(sql, [src, dest, hash], function (err, row, fields) {
            if (err) {
                console.error(`ERROR : ${err}`)
                res.send("false")
            }
            else if (row.length > 0) {
                console.info(`INFO : Data request verified with source ${src} and destination ${dest}`)
                res.send("true")
            } else {
                res.send("false")
                console.error(`ERROR : File Request Token ${hash} Not Found`)
            }
        });
    } catch (err) {
        console.error(`ERROR : ${err}`)
    }
}

app.get('/status',(req,res)=>{
    res.send(200)
})


// home route
app.post('/', (req, res) => {
    var json_req = req.body
    console.info("INFO : Request received at doctor")
    console.info("INFO : Request on doctor is of type : " + json_req.type)
    if (json_req.type == "data") {
        var token = {
            iv: json_req.doctor1,
            content: json_req.doctor2
        }
        var token = decrypt(token)
        console.log(json_req)
        authenticate(json_req.source, json_req.dest, token, res)
    } else {
        var ID = json_req.serviceID
        fileTransferCheck(json_req.source, json_req.dest, ID, json_req.hash, res)
    }

})
app.listen(port, IP, err => {
    if (err) throw err;
    console.info(`INFO : ${config.DOCTOR_NAME} Server listening on http://${IP}:${port}`);
})

//npm start --docDB=192.168.1.1
const {encrypt,decrypt} = require("./crypto.js");
const doctor_db = require("./database/doctor_database");
const { v4: uuidv4 } = require("uuid");
var http = require('http');
var querystring = require('querystring');
const DoctorPort = 8080
const doctor_ip = process.env.npm_config_docIP || 'localhost';


function doctor(src, dest) {
    var sql = `INSERT INTO ${src} (TimeStamp,Token,Dest) VALUES(CURRENT_TIMESTAMP(),?,?)`
    var token = uuidv4();

    doctor_db.query(sql, [token, dest], function (err, row, fields) {
        if (err) {
            console.log(err)
            return null
        }
    });
    return encrypt(token)
}
function doctorFileTranfer(src,dest,hash,serviceID){
    var sql = `INSERT INTO fileTransfer (src,dest,hash,serviceID) VALUES(?,?,?,?)`

    doctor_db.query(sql, [src, dest,hash,serviceID], function (err, row, fields) {
        if (err) {
            console.log(err)
            return null
        }
    });
}
function file_transfer_Check(serviceID, src, res,hash){
    var json_req = {
        ID:serviceID,
        source: src,
        dest: "c2",
        type: "file",
        hash:hash
    }
    doctorAPI(json_req, src, res)
}
function data_transfer_check(token, src, res){
    var json_req = {
        doctor1: token.iv,
        doctor2: token.content,
        source: src,
        dest: "c2",
        type:"data"
    }
    doctorAPI(json_req, src, res)
}



function doctorAPI(json_req, src, res) {
    
    console.log("Verifying the request from " + src + " on c2")
    var data = querystring.stringify(json_req);

    var options = {
        host: doctor_ip,
        port: DoctorPort,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var httpreq = http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log("Reponse from Doctor in C2 : " + chunk)
            if (chunk == "true") {
                //means request is true
                res.send("true")
            } else {
                res.send("false")
                res.end()
            }
        });
        response.on('end', function () {
            console.log("Doctor verified the incoming request")
        })
    });
    httpreq.write(data);
    httpreq.end();
}


module.exports = {doctor,file_transfer_Check,data_transfer_check,doctorFileTranfer}
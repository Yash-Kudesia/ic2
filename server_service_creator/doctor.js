var querystring = require('querystring');
const doctor_db = require("./database/doctor_database");
const { encrypt, decrypt } = require("./crypto")
const { v4: uuidv4 } = require("uuid");
var http = require('http');
var doctor_ip  = '172.7.0.6';
const DoctorPort = 8080

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

function doctorAPI(token, src, res) {
    var json_req = {
        doctor1: token.iv,
        doctor2: token.content,
        source: src,
        dest: "s2"
    }
    console.log("Verifying the request from " + src + " on s2")
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
            console.log("Reponse from Doctor in S2 : " + chunk)
            if (chunk == "true") {
                //means request is true
                res.send("true")
            } else {
                res.send("false")
            }
        });
        response.on('end', function () {
            console.log("Doctor verified the incoming request")
        })
    });
    httpreq.write(data);
    httpreq.end();
}


module.exports = {doctor,doctorAPI}
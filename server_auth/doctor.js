const { v4: uuidv4 } = require("uuid");
const querystring = require('querystring')
const doctor_db = require("./database/doctor_database");
const { encrypt, decrypt } = require("./crypto")
var http = require('http');
var doctor_ip  = 'localhost';
const DoctorPort = 3005
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

function doctorAPI(token, src) {
    var json_req = {
        doctor1: token.iv,
        doctor2: token.content,
        source: src,
        dest: "a",
        type:"data"
    }
    console.log("Verifying the request from " + src + " on Auth Server")
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
            console.log("Reponse from Doctor in Auth Server : " + chunk)
            if (chunk == "true") {
                //means request is true
                console.log("true from doctor in auth")
            } else {
                console.log("false from doctor in auth")
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
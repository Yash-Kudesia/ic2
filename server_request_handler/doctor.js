var querystring = require('querystring');
const doctor_db = require("./database/doctor_database");
const { encrypt, decrypt } = require("./crypto")
const { v4: uuidv4 } = require("uuid");
var http = require('http');

var config = require("./config")

const doctor_ip  = config.DOCTOR_IP;
const DoctorPort = config.DOCTOR_PORT

function doctor(src, dest) {
    var sql = `INSERT INTO ${src} (TimeStamp,Token,Dest) VALUES(CURRENT_TIMESTAMP(),?,?)`
    var token = uuidv4();

    doctor_db.query(sql, [token, dest], function (err, row, fields) {
        if (err) {
            console.error(`ERROR : ${err}`)
            return null
        }
    });
    return encrypt(token)
}

function doctorAPI(token, src, res,param,callBack) {
    var json_req = {
        doctor1: token.iv,
        doctor2: token.content,
        source: src,
        dest: config.S1_NAME,
        type:"data"
    }
    console.info(`INFO : Sending request to ${config.DOCTOR_NAME} for verification with source ${src} and destination ${config.S1_NAME}`)
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
            if (chunk == "true") {
                console.info(`INFO : ${config.DOCTOR_NAME} verification success with source ${src} and destination ${config.S1_NAME}`)
                callBack(param,config.S2_IP,config.S2_PORT)
                res.send("true")
                console.info(`INFO : Status OK sent to ${src} from ${config.S1_NAME}`)
            } else {
                console.info(`INFO : ${config.DOCTOR_NAME} verification failed with source ${src} and destination ${config.S1_NAME}`)
                res.send("false")
            }
        });
        response.on('end', function () {
            console.info(`INFO : ${config.DOCTOR_NAME} checking completed`)
        })
    });
    httpreq.write(data);
    httpreq.end();
}


module.exports = {doctor,doctorAPI}
const { v4: uuidv4 } = require("uuid");
const doctor_db = require("./database/doctor_database");
const { encrypt, decrypt } = require("./crypto")
var http = require('http');
var config = require('./config')

var doctor_ip  = config.DOCTOR_IP;
const DoctorPort = config.DOCTOR_PORT;

function doctor(src, dest,param=null,callback=null) {
    return  new Promise((resolve, reject) => {
        console.log("INFO : Promise")
        var sql = `INSERT INTO ${src} (TimeStamp,Token,Dest) VALUES(CURRENT_TIMESTAMP(),?,?)`
        var token = uuidv4();
        doctor_db.query(sql, [token, dest], function (err, row, fields) {
            if (err) {
                console.info("DB INSERTION ERROR : "+err)
                reject(err)
            }else{
                 if(param!=null){
                    var secret =  encrypt(token)
                    param[0]["doctor1"] = secret.iv
                    param[0]["doctor2"] = secret.content
                    callback(param[0],param[1],param[2],param[3])
                }
            }
        });
        resolve(encrypt(token))
    })

}

function doctorAPI(token, src, res) {
    var json_req = {
        doctor1: token.iv,
        doctor2: token.content,
        source: src,
        dest: "s1",
        type:"data"
    }
    console.info(`INFO : Sending request to ${config.DOCTOR_NAME} for verification with source ${src} and destination ${config.W1_NAME}`)
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
                //means request is true
                console.info(`INFO : ${config.DOCTOR_NAME} verification success with source ${src} and destination ${config.W1_NAME}`)
                res.send("true")
            } else {
                res.send("false")
                console.info(`INFO : ${config.DOCTOR_NAME} verification failed with source ${src} and destination ${config.W1_NAME}`)
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
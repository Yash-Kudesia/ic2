const { encrypt, decrypt } = require("./crypto.js");
const doctor_db = require("./database/doctor_database");
const { v4: uuidv4 } = require("uuid");
var http = require('http');
var querystring = require('querystring');
var config = require('./config')

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
function doctorFileTranfer(src, dest, hash, serviceID) {
    var sql = `INSERT INTO filetransfer (src,dest,hash,serviceID) VALUES(?,?,?,?)`

    doctor_db.query(sql, [src, dest, hash, serviceID], function (err, row, fields) {
        if (err) {
            console.log(err)
            return null
        }
    });
}
function file_transfer_Check(serviceID, src, res, hash,param,callback) {
    return new Promise((resolve, reject) => {
        try {
            var json_req = {
                ID: serviceID,
                source: src,
                dest: "c2",
                type: "file",
                hash: hash
            }
            doctorAPI(json_req, src, res,param,callback).then((data)=>{
               
                resolve(data);
            })
        } catch (err) {
            reject(err)
        }
    })
}
function data_transfer_check(token, src, res) {
    return new Promise((resolve, reject) => {
        try {
            var json_req = {
                doctor1: token.iv,
                doctor2: token.content,
                source: src,
                dest: "c2",
                type: "data"
            }
            doctorAPI(json_req, src, res).then((data)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            })
        } catch (err) {
            reject(err)
        }
    })

}



function doctorAPI(json_req, src, res,param=null,callback=null) {
    return new Promise((resolve, reject) => {
        try {
            console.info(`INFO : Sending request to ${config.DOCTOR_NAME} for verification with source ${src} and destination ${config.C2_NAME}`)
            var data = querystring.stringify(json_req);
            var options = {
                host: config.DOCTOR_IP,
                port: config.DOCTOR_PORT,
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
                        console.info(`INFO : ${config.DOCTOR_NAME} verification success with source ${src} and destination ${config.C2_NAME}`)
                        if(param!=null){
                            callback(param[0])
                        }
                        resolve("true")
                    } else {
                        console.info(`INFO : ${config.DOCTOR_NAME} verification failed with source ${src} and destination ${config.C2_NAME}`)
                        resolve("false")
                    }
                });
                response.on('end', function () {
                    console.info(`INFO : ${config.DOCTOR_NAME} checking completed`)
                })
            });
            httpreq.write(data);
            httpreq.on('error', function (error) {
                reject(error)
            });
            httpreq.end();
        } catch (err) {
            reject(err)
        }
    })
}


module.exports = { doctor, file_transfer_Check, data_transfer_check, doctorFileTranfer }
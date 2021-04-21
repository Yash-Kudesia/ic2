const nsmDB = require("./database/nsm_database")
const sendRequest = require("./request")
var crypto = require('crypto');

const { doctor, doctorAPI, doctorFileTranfer } = require("./doctor.js")

var color = require("./status_color")
var config = require('./config')
const clientHost = config.C2_IP
const clientPort = config.C2_PORT

const fs = require('fs');
const path = require('path');
const request = require('request');


function getENV(){
    console.info(color.FgYellow,`GET ENV CALLED`)
    //console.info(color.FgYellow,`GET ENV ${Object.getOwnPropertyNames(process.env.active_service)}`)
    var s = process.env.active_service.split(",")
    if(s.length>0){
        var ele = s.shift()
        process.env.active_service = s.join()
        if(process.env.archive_service){
            var s1 = process.env.archive_service
            s1+=","+ele
            process.env.archive_service = s1
        }else{
            var s2 = ele
            process.env.archive_service = s2
        }
        return ele
    }else{
        return null
    }
}
function setENV(id){
    console.info(color.FgYellow,`SET ENV CALLED`)
    if(process.env.active_service){
        var s = process.env.active_service
        s+=","+id
        process.env.active_service = s
        //console.info(color.FgYellow,`SET new append ${id}`)
    }else{
        var s = id
        process.env.active_service = s
        //console.info(color.FgYellow,`SET new init ${id}`)
    }
}

var getHash = (content) => {
    try {
        var hash = crypto.createHash('md5');
        //passing the data to be hashed
        data = hash.update(content, 'utf-8');
        //Creating the hash in the required format
        gen_hash = data.digest('hex');
        return gen_hash;
    } catch (err) {
        console.error(color.FgRed,`ERROR : ${err}`)
        return null
    }
}


function getClientIP(clientID) {
    //find th ip from the nsm db
    try {
        nsmDB.query('SELECT * from client_ip_table WHERE PhysicalID = ?', [clientID], function (err, row, fields) {
            if (err) {
                console.error(color.FgRed,`ERROR : ${err}`)
                return null
            } else {
                if (row.length > 0) {
                    return row[0].IP
                }
            }
        });
    } catch (err) {
        console.error(color.FgRed,`ERROR : ${err}`)
    }
}

// function connect_with_client(){
//     //make the final connection heath checks and getting ports and all
//     //.........................................?



// }
function getStatusUtil(clientIP, type) {
    return new Promise((resolve, reject) => {
        try {
            var json_req = {
                ip: clientIP,
                type: type
            }
            //convert the client IP to host and port for connection.........................?
            var host = clientHost
            var port = clientPort
            sendRequest(json_req, host, port, `/route/${type}`).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.error(color.FgRed,`ERROR : ${err}`)
                reject(err)
            })
        } catch (err) {
            console.error(color.FgRed,`ERROR : ${err}`)
            reject(err)
        }
    })

}

function health_check(client_ip, res) {
    return new Promise((resolve, reject) => {
        console.info(`INFO : Geneating request for performing health check`)
        try {
            getStatusUtil(client_ip, "health").then((data) => {
                resolve(data)
            }).catch((err) => {
                console.error(color.FgRed,`ERROR : ${err}`)
                reject(err)
            })
        } catch (err) {
            console.error(color.FgRed,`ERROR : ${err}`)
            reject(err)
        }
    })

}


function getAvailablePort(client_ip) {
    return new Promise((resolve, reject) => {
        getStatusUtil(client_ip, "port").then((data) => {
            resolve(data)
        }).catch((err) => {
            console.error(color.FgRed,`ERROR : ${err}`)
            reject(err)
        })
    })
}

function completeMakeFile(port) {
    //complete the makefile recived from S2 and return the command to run it
    if (port) {
        return "sh"
    } else {
        return null
    }
}
function sendFile(serviceID, IP, port) {
    //var filename = "Makefile_S3"
    console.info(`Preparing FILE for sending with ID ${serviceID} to ${IP}:${port}`)
    var fileName = path.resolve(__dirname, `makefiles/${serviceID}_BY_S2`);
    var target = `http://${IP}:${port}/route/file/`
    var rs = fs.createReadStream(fileName);
    var ws = request.post(target,function(err, res, body) {
        if(err){
            console.info(color.FgRed,`ERROR : Send File error - ${err}`);
        }else{
            console.info(color.FgGreen,`INFO : Send File status recieved from  ${IP}:${port} - ${Object.getOwnPropertyNames(res)}`);
        }
    })

    ws.on('drain', function () {
        console.info(color.FgGreen,'INFO : file data drain', new Date());
        rs.resume();
    });
    var rContents = '' // to hold the read contents;
    rs.on('data', function (chunk) {
        rContents += chunk;
    });
    rs.on('end', function () {
        var content = getHash(rContents);
        if (content != null) {
            console.info(color.FgGreen,`INFO : Hash of the file generated, sent to ${config.C2_NAME}, sending to ${config.DOCTOR_NAME} for saving`)
            doctorFileTranfer(config.S3_NAME, config.C2_NAME, content, serviceID)
        } else {
            console.error(color.FgRed,`ERROR : Hash of file is null, terminating doctor check`)
        }

    });
    ws.on('error', function (err) {
        console.error(color.FgRed,'ERROR : cannot send file to ' + target + ': ' + err);
    });

    rs.pipe(ws);
    return
}

function sendtoClientMakeFile(serviceID, fileCommand, json_req, IP, port) {
    var secret = doctor(config.S3_NAME, config.C2_NAME)
    var client_json = {
        command: fileCommand,
        doctor1: secret.iv,
        doctor2: secret.content
    }
    sendRequest(client_json, IP, port, "/route/command/")
    sendFile(serviceID, IP, port)

}

function populatePort(req,serviceID,IP,port) {
    console.info(color.FgGreen,"INFO : Populating port function")
    sendFile(serviceID, IP, port)
    // var json_req = req.session.json_req
    // var IP = req.session.clientIP
    // var port = req.session.port
    // //populate the MakeFile from S2 with this port
    // var MakeFilestatus = completeMakeFile(port)
    // if (MakeFilestatus != null) {
    //     //makefile successfully completed
    //     var secret = doctor(config.S3_NAME, config.C2_NAME)
    //     var json_req_send = {
    //         username: json_req.username,
    //         sessionID: json_req.sessionID,
    //         serviceID: json_req.serviceID,
    //         physicalID: json_req.physicalID,
    //         doctor1: secret.iv,
    //         doctor2: secret.content
    //     }
    //     //now forward it to client
    //     sendtoClientMakeFile(json_req.serviceID, MakeFilestatus, json_req_send, IP, port)
    //     // ? Update in Connection Handler 
    //     // ? Service Request |  status | client ID  | Session 
    //     // ? trigger in Connection Handler to inform W1 about the service 
    // } else {
    //     console.error(color.FgRed,"ERROR : Some error in Makefile")
    //     //res.send("Some error in Makefile from S2 in S3")
    // }
}


module.exports = {
    getClientIP,
    getAvailablePort,
    health_check,
    sendtoClientMakeFile,
    completeMakeFile,
    populatePort,
    getHash,
    getENV,
    setENV
}
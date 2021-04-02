const nsmDB = require("./database/nsm_database")
const sendRequest = require("./request")
const {doctor,doctorAPI} = require("./doctor")

const ClientStatuChannelPort = 4000
const fs = require('fs');
const path = require('path');
const request = require('request');


function getClientIP(clientID){
    //find th ip from the nsm db
    nsmDB.query('SELECT * from client_ip_table WHERE PhysicalID = ?', [clientID], function (err, row, fields) {
        if (err) {
            console.log(err)
            return null
        }else{
            if(row.length>0){
                return row[0].IP
            }
        }
    });
}

// function connect_with_client(){
//     //make the final connection heath checks and getting ports and all
//     //.........................................?



// }
function getStatusUtil(clientIP,type){
    var json_req = {
        ip:clientIP,
        type:type
    }
    //convert the client IP to host and port for connection.........................?
    var host = "localhost"
    var port = ClientStatuChannelPort
    return sendRequest(json_req,host,port)
}


function health_check(client_ip,res){
    return getStatusUtil(client_ip,"health")
}


function getAvailablePort(client_ip){
    return getStatusUtil(client_ip,"port")
}

function completeMakeFile(req){
    //complete the makefile recived from S2 and return the command to run it
    return null
}
function sendFile(IP,port){
    var fileName = "Makefile_S3"
    var target = `http://${IP}:${port}/route/file/`
    var rs = fs.createReadStream(fileName);
    var ws = request.post(target);
    
    ws.on('drain', function () {
      console.log('drain', new Date());
      rs.resume();
    });
    rs.on('end', function () {
      console.log('sent to ' + target);
    });
    ws.on('error', function (err) {
      console.error('cannot send file to ' + target + ': ' + err);
    });
    
    rs.pipe(ws);
}

function sendtoClientMakeFile(fileCommand,json_req,IP,port){
    sendFile(IP,port)
    var secret = doctor("s3","c1")
    var client_json = {
        command:fileCommand,
        doctor1:secret.iv,
        doctor2:secret.content
    }
    sendRequest(client_json,IP,port,"/route/command/")
}


// async function client_health_checker(physicalID){
//    try{
//     var ip = await getClientIP(physicalID);
//     var health = await health_check(ip);
//     return health
//    }catch(error){
//        console.log(error)
//         return "false"
//    } 
// }


module.exports = {
    getClientIP,
    getAvailablePort,
    health_check,
    sendtoClientMakeFile,
    completeMakeFile
}
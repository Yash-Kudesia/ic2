const nsmDB = require("./database/nsm_database")
const sendRequest = require("./request")
var crypto = require('crypto');

const {doctor,doctorAPI,doctorFileTranfer} = require("./doctor.js")

var config = require('./config')
const clientHost = config.C2_IP
const clientPort = config.C2_PORT

const fs = require('fs');
const path = require('path');
const request = require('request');


var getHash = ( content ) => {				
    var hash = crypto.createHash('md5');
    //passing the data to be hashed
    data = hash.update(content, 'utf-8');
    //Creating the hash in the required format
    gen_hash= data.digest('hex');
    return gen_hash;
  }

  
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
    var host = clientHost
    var port = clientPort
    return sendRequest(json_req,host,port,`/route/${type}`)
}


function health_check(client_ip,res){
    return getStatusUtil(client_ip,"health")
}


function getAvailablePort(client_ip){
    return getStatusUtil(client_ip,"port")
}

function completeMakeFile(port){
    //complete the makefile recived from S2 and return the command to run it
    return null
}
function sendFile(serviceID,IP,port){
    var fileName = "Makefile_S3"
    var target = `http://${IP}:${port}/route/file/`
    var rs = fs.createReadStream(fileName);
    var ws = request.post(target);
    
    ws.on('drain', function () {
      console.log('drain', new Date());
      rs.resume();
    });
    var rContents = '' // to hold the read contents;
    rs.on('data', function(chunk) {
        rContents += chunk;
    });
    rs.on('end', function () {
      console.log('sent to ' + target);
      var content = getHash(rContents) ;
      console.log("Hash of the file generated, to be sent to S3")
      doctorFileTranfer("s3","c2",content,serviceID)

    });
    ws.on('error', function (err) {
      console.error('cannot send file to ' + target + ': ' + err);
    });
    
    rs.pipe(ws);
}

function sendtoClientMakeFile(serviceID,fileCommand,json_req,IP,port){
    var secret = doctor("s3","c1")
    var client_json = {
        command:fileCommand,
        doctor1:secret.iv,
        doctor2:secret.content
    }
    sendRequest(client_json,IP,port,"/route/command/")
    sendFile(serviceID,IP,port)
    
}

function populatePort(req){
    var json_req = req.session.json_req
    var IP = req.session.clientIP
    var port = req.session.port
    //populate the MakeFile from S2 with this port
    var MakeFilestatus = completeMakeFile(port)
    if(MakeFilestatus!=null){
        //makefile successfully completed
        var secret = doctor("s3","c2")
        var json_req_send = {
            username: json_req.username,
            sessionID: json_req.sessionID,
            serviceID:json_req.serviceID,
            physicalID: json_req.physicalID,
            doctor1:secret.iv,
            doctor2:secret.content
        }
        //now forward it to client
        sendtoClientMakeFile(json_req.serviceID,MakeFilestatus,json_req_send,IP,port)
        // ? Update in Connection Handler 
        // ? Service Request |  status | client ID  | Session 
        // ? trigger in Connection Handler to inform W1 about the service 
    }else{
        console.log("Some error in Makefile from S2 in S3")
        res.send("Some error in Makefile from S2 in S3")
    }
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
    completeMakeFile,
    populatePort,
    getHash
}
const { doctor, doctorAPI } = require("./doctor.js")
const sendRequest = require("./request")
var express = require("express");
var router = express.Router();

const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3006)       //client will be subscribed to this channel for the updates

const {
    getClientIP,
    getAvailablePort,
    health_check,
    sendtoClientMakeFile,
    completeMakeFile
} = require("./utils")

io.sockets.on("connection", function() {
    console.log("Client subscribed to the channel")
});

router.post('/', (req, res) => {
    var json_req = req.body;
    var token = {
        iv: json_req["doctor1"],
        content: json_req["doctor2"]
    }
    doctorAPI(token, json_req.src, res);
    var IP = getClientIP(json_req.physicalID)
    var health = health_check(IP,res) 
    if (health=="true") {
        var port = getAvailablePort(IP);
        req.session.port = port
        req.session.clientIP = IP
        //populate the MakeFile from S2 with this port
        var MakeFilestatus = completeMakeFile(json_req)
        if(MakeFilestatus!=null){
            //makefile successfully completed
            //now forward it to client
            sendtoClientMakeFile(MakeFilestatus,json_req,IP,port)
            // ? Update in Connection Handler 
            // ? Service Request |  status | client ID  | Session 
            // ? trigger in Connection Handler to inform W1 about the service 
        }else{
            console.log("Some error in Makefile from S2 in S3")
            res.send("Some error in Makefile from S2 in S3")
        }
    } else {
        res.send("Selected client is not ready for request")
    }
})


module.exports = router
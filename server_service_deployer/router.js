const {doctor,file_transfer_Check,data_transfer_check,doctorFileTranfer} = require("./doctor.js")
const sendRequest = require("./request")
var express = require("express");
var router = express.Router();
const path = require('path')
const fs = require('fs')
const {
    getClientIP,
    getAvailablePort,
    health_check,
    sendtoClientMakeFile,
    completeMakeFile,
    populatePort,
    getHash
} = require("./utils")

// const app = express()
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// http.listen(3007)       //client will be subscribed to this channel for the updates
// io.sockets.on("connection", function() {
//     console.log("Client subscribed to the channel")
// });



router.post('/file',(req,res)=>{
    console.log("File receive request on S3 arrived")
    var filename = path.resolve(__dirname,`${req.session.serviceID}_BY_S2`);
    var dst = fs.createWriteStream(filename);
    req.pipe(dst);
    dst.on('drain', function() {
      console.log('drain', new Date());
      req.resume();
    });
    req.on('end', function () {
        //create hash from the file
        var rs = fs.createReadStream(filename);
        
        var rContents = '' // to hold the read contents;
        rs.on('data', function(chunk) {
            rContents += chunk;
        });
        rs.on('end', function () {
          console.log('file recived on S3');
          var content = getHash(rContents) ;
          console.log("Hash of the file generated, to be sent to doctor for verification")
          file_transfer_Check(req.session.serviceID,"s2",res,content)
          res.send("ok");
          populatePort(req)
        }); 
    });
})

router.post('/', (req, res) => {
    var json_req = req.body;
    var token = {
        iv: json_req["doctor1"],
        content: json_req["doctor2"]
    }
    console.log("Request recieved at S3")
    data_transfer_check(token, json_req.src, res);
    
    req.session.clientIP = IP
    req.session.json_req = json_req
    req.session.serviceID = json_req.serviceID
    console.log("Data saved : "+req.session.serviceID)
    var IP = getClientIP(json_req.physicalID)
    var health = health_check(IP,res) 
    if (health=="true") {
        var port = getAvailablePort(IP);
        req.session.port = port
        //now we have fetched port and done health checkup
        //next we will be wating on a endpoint for a file from S2 to do further work
    } else {
        res.send("Selected client is not ready for request")
    }
})


module.exports = router
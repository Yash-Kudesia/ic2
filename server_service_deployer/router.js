const {doctor,file_transfer_Check,data_transfer_check,doctorFileTranfer} = require("./doctor.js")
const sendRequest = require("./request")
var express = require("express");
var router = express.Router();
const path = require('path')

const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3006)       //client will be subscribed to this channel for the updates

const {
    getClientIP,
    getAvailablePort,
    health_check,
    sendtoClientMakeFile,
    completeMakeFile,
    populatePort,
    getHash
} = require("./utils")

io.sockets.on("connection", function() {
    console.log("Client subscribed to the channel")
});

router.post('/file',(req,res)=>{

    var filename = path.resolve(__dirname, "MakeFile_S2");
    var dst = fs.createWriteStream(filename);
    req.pipe(dst);
    dst.on('drain', function() {
      console.log('drain', new Date());
      req.resume();
    });
    req.on('end', function () {
        //create hash from the file
        var rs = fs.createReadStream(fileName);
        
        var rContents = '' // to hold the read contents;
        rs.on('data', function(chunk) {
            rContents += chunk;
        });
        rs.on('end', function () {
          console.log('sent to ' + target);
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
    data_transfer_check(token, json_req.src, res);
    var IP = getClientIP(json_req.physicalID)
    var health = health_check(IP,res) 
    if (health=="true") {
        var port = getAvailablePort(IP);
        req.session.port = port
        req.session.clientIP = IP
        req.session.json_req = json_req
        req.session.serviceID = json_req.serviceID
        //now we have fetched port and done health checkup
        //next we will be wating on a endpoint for a file from S2 to do further work
    } else {
        res.send("Selected client is not ready for request")
    }
})


module.exports = router
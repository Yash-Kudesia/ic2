const {doctor,doctorAPI,doctorFileTranfer} = require("./doctor.js")
const sendRequest = require("./request")
const {sendMakeFile} = require("./utils")
var express = require("express");
var router = express.Router();

var config = require('./config')
const S3_IP = config.S3_IP;
const S3_Port = config.S3_PORT


router.post("/",(req,res)=>{
    //request will be recieved here from S1
    console.log("Request received at S2 : " + Object.getOwnPropertyNames(req.body))
    var json_req = req.body
    var token = {
        iv: json_req["doctor1"],
        content: json_req["doctor2"]
    }
    doctorAPI(token, json_req["src"], res)
    var secret = doctor("s2","s3")

    var json_req_send = {
        username: json_req.username,
        sessionID: json_req.sessionID,
        serviceID:json_req.serviceID,
        os: json_req.os,
        physicalID: json_req.physicalID,
        doctor1:secret.iv,
        doctor2:secret.content,
        src:"s2"
    }
    //do the docker work here
//-------------------------------------------------------------------------------????
    //send request to S3
    //all from S1 - config +MakeFile send by S2 to S3
    sendRequest(json_req_send,res,S3_IP,S3_Port)
    sendMakeFile(json_req.serviceID,S3_IP,S3_Port)
})

module.exports = router
const { fetchData, fetchServiceID } = require("./utils");
const { doctor, doctorAPI } = require("./doctor");
var express = require("express");
const sendRequest = require("./request");
var router = express.Router();
const S2_IP = process.env.npm_config_S2IP || 'localhost',
const S2_Port = 3003
// home route
router.post('/', (req, res) => {
    //run the doctor here
    console.log("S1 POST REQUEST RECIEVED")
    console.log("Request received at S1 : " + Object.getOwnPropertyNames(req.body))
    // var json_req = JSON.parse(req.body)
    var json_req = req.body
    var token = {
        iv: json_req["doctor1"],
        content: json_req["doctor2"]
    }
    doctorAPI(token, json_req["src"], res)
    var secret = doctor("s1","s2")

    //perform all three steps of S1 here
    var physicalID = fetchData(json_req.user);
    var json_req_send = {
        username: json_req.username,
        sessionID: json_req.sessionID,
        serviceID:json_req.serviceID,
        os: json_req.os,
        physicalID: physicalID,
        doctor1:secret.iv,
        doctor2:secret.content
    }
    //send the request here to S2
    sendRequest(json_req_send,S2_IP,S2_Port)


})

module.exports = router

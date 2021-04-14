const { fetchData, fetchServiceID, handlePOSTreq } = require("./utils");
const { doctor, doctorAPI } = require("./doctor");
var express = require("express");

var router = express.Router();
var config = require("./config")
var color = require("./status_color")

router.get('/status',(req,res)=>{
    res.send(200)
})

// home route
router.post('/', (req, res) => {
    //run the doctor here
    console.info(color.FgGreen,`INFO : Request received at ${config.S1_NAME}`)
    // var json_req = JSON.parse(req.body)
    var json_req = req.body
    var token = {
        iv: json_req["doctor1"],
        content: json_req["doctor2"]
    }

    doctor(config.S1_NAME, config.S2_NAME).then((data) => {
        var secret = data
        //perform all three steps of S1 here

        //uncomment this line after testing
        //var physicalID = fetchData(json_req.user);
        var physicalID = "123456789"
        var json_req_send = {
            username: json_req.username,
            sessionID: json_req.sessionID,
            serviceID: json_req.serviceID,
            os: json_req.os,
            physicalID: physicalID,
            doctor1: secret.iv,
            doctor2: secret.content,
            src: "s1"
        }
        //send the request here to S2
        handlePOSTreq(token, json_req, json_req_send, res)
        //doctorAPI(token, json_req["src"], res)
        //sendRequest(json_req_send,S2_IP,S2_Port)
    }).catch((err)=>{
        console.error(color.FgRed,`ERROR : ${err}`)
        res.send("False")
    })

})

module.exports = router

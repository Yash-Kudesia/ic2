const {fetchData,fetchServiceID} = require("./utils");
const {doctor,doctorAPI} = require("./doctor.js")
var express = require("express");
var router = express.Router();

// home route
router.post('/', (req, res) => {
    //run the doctor here
    console.log("Request received at S1 : " + Object.getOwnPropertyNames(req.body))
    // var json_req = JSON.parse(req.body)
    var json_req = req.body
    var token = {
        iv: json_req["doctor1"],
        content: json_req["doctor2"]
    }
    doctorAPI(token, json_req["src"], res)
    //perform all three steps of S1 here
       var physicalID = fetchData(json_req.user);
        var json_req = {
            'username':req.username,
            'sessionID':req.sessionID,
            'os':req.os,
            'physicalID':physicalID
        }

    //send the request here to S2
})

module.exports = router

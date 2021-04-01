const {doctor,doctorAPI} = require("./doctor.js")
const sendRequest = require("./request")
var express = require("express");
var router = express.Router();

router.post("/",(req,res)=>{
    //request will be recieved here from S1
    console.log("Request received at S2 : " + Object.getOwnPropertyNames(req.body))
    var json_req = req.body
    var token = {
        iv: json_req["doctor1"],
        content: json_req["doctor2"]
    }
    doctorAPI(token, json_req["src"], res)

    //do the docker work here

    //send request to S3

})

module.exports = router
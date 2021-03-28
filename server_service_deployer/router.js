const { doctor, doctorAPI } = require("./doctor.js")
const sendRequest = require("./request")
var express = require("express");
var router = express.Router();
const {
    getClientAddress,
    verifyServiceRequest,
    connect_with_client,
    health_check,
    getAvailablePort,
} = require("./utils")


router.post('/', (req, res) => {
    var json_req = req.body;
    var token = {
        iv: json_req["doctor1"],
        content: json_req["doctor2"]
    }
    doctorAPI(token, json_req.src, res);

    var ip = getClientAddress(json_req.physicalID);
    var health = health_check(ip);
    if (health) {
        var status = run_script();
        // Update in Connection Handler 
        // Service Request |  status | client ID  | Session 
        // trigger in Connection Handler to inform W1 about the service 

        var json_req = {
            'username': req.username,
            'host': req.hostname,
            'sessionID': req.sessionID,
        }

        //send the request here to client here

    } else {
        res.send("Selected client is not ready for request")
    }
 })


module.exports = router
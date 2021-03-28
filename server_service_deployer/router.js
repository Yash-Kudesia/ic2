const {doctor,doctorAPI} = require("./doctor.js")
var express = require("express");
var router = express.Router();
const {
    getClientAddress,
    verifyServiceRequest,
    connect_with_client,
    health_check,
    getAvailablePort,
} = require("./utils")

// home route
router.post('/', (req, res) =>{
    //Doctor
    var authenicated = verifyServiceRequest(req);
 
    var ip = getClientAddress(req.physicalID);
    var health  = health_check(ip);
 
    var status = run_script();
 
    // Update in Connection Handler 
    // Service Request |  status | client ID  | Session 
    // trigger in Connection Handler to inform W1 about the service 
    
     var json_req = {
         'username':req.username,
         'host':req.hostname,
         'sessionID':req.sessionID,
     }
 
     //send the request here to S2
 
 })


module.exports = router
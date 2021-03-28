const { doctor, doctorAPI } = require("./doctor.js")
const sendRequest = require("./request")
var express = require("express");
var router = express.Router();
const {
    connect_with_client,
    getAvailablePort,
    client_health_checker
} = require("./utils")
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3006)       //client will be subscribed to this channel for the updates

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

    var health = client_health_checker(json_req.physicalID)
    if (health) {
        var status = run_script();
        var ports = getAvailablePort();
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
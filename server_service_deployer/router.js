const { doctor, file_transfer_Check, data_transfer_check, doctorFileTranfer } = require("./doctor.js")
var express = require("express");
var router = express.Router();
const path = require('path')
const fs = require('fs')

var color = require("./status_color")
const config = require("./config")
const {
    getClientIP,
    getAvailablePort,
    health_check,
    sendtoClientMakeFile,
    completeMakeFile,
    populatePort,
    getHash
} = require("./utils")


router.post('/file', (req, res) => {
    console.info(color.FgGreen,`INFO : File receive request on ${config.S3_NAME} arrived`)
    var filename = path.resolve(__dirname, `${req.session.serviceID}_BY_S2`);
    var dst = fs.createWriteStream(filename);
    req.pipe(dst);
    dst.on('drain', function () {
        console.info(color.FgGreen,`INFO : file read drain -  ${new Date()}`);
        req.resume();
    });
    req.on('end', function () {
        //create hash from the file
        var rs = fs.createReadStream(filename);

        var rContents = '' // to hold the read contents;
        rs.on('data', function (chunk) {
            rContents += chunk;
        });
        rs.on('end', function () {
            console.info(color.FgGreen,`INFO : File recieved on ${config.S3_NAME}`);
            var content = getHash(rContents);
            console.info(color.FgGreen,`INFO : Hash of the file generated, to be sent to doctor for verification`)
            console.info(color.FgGreen,`INFO : Hash is ${content}`)
            file_transfer_Check(req.session.serviceID, config.S2_NAME, res, content).then(() => {
                //res.send("ok");
                populatePort(req)
            }).catch((err) => {
                try{
                    console.error(color.FgRed,`ERROR : ${err}`)
                    res.send("False")
                }catch(err){
                    console.error(color.FgRed,`ERROR : ${err}`)
                }
            })

        });
    });
})

router.post('/', (req, res) => {
    var json_req = req.body;
    var token = {
        iv: json_req["doctor1"],
        content: json_req["doctor2"]
    }
    console.info(color.FgGreen,`INFO : Request recieved at ${config.S3_NAME}`)
    data_transfer_check(token, json_req.src, res).then((data) => {
        if(data=="true"){
            res.send("true")
            console.info(`INFO : Request Data Checked`)
            req.session.clientIP = IP
            req.session.json_req = json_req
            req.session.serviceID = json_req.serviceID
            console.info(color.FgGreen,`INFO : Data saved - ${req.session.serviceID}`)
            var IP = getClientIP(json_req.physicalID)
            health_check(IP, res).then((data) => {
                var health = data
                if (health == "true") {
                    var port = getAvailablePort(IP);
                    req.session.port = port
                    res.send("True")
                    //now we have fetched port and done health checkup
                    //next we will be wating on a endpoint for a file from S2 to do further work
                } else {
                    console.error(color.FgRed,"ERROR : Selected client is not ready for request")
                    res.send("False")
                }
            }).catch((err) => {
                try{
                    console.error(color.FgRed,`ERROR : ${err}`)
                    res.send("False")
                }catch(err){
                    console.error(color.FgRed,`ERROR : ${err}`)
                }
            })
        }else{
            res.send("false")
        }
    })
})


module.exports = router
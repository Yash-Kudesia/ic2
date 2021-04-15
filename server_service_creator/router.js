const { doctor, doctorAPI, doctorFileTranfer } = require("./doctor.js")
const sendRequest = require("./request")
const { sendMakeFile } = require("./utils")
var express = require("express");
var router = express.Router();
var { createWithConfig } = require("./create_image_util")

var color = require('./status_color')
var config = require('./config')
const S3_IP = config.S3_IP;
const S3_Port = config.S3_PORT

router.get('/status', (req, res) => {
    res.send(200)
})

router.post("/", (req, res) => {
    //request will be recieved here from S1
    console.info(color.FgGreen, `INFO : Request received at ${config.S2_NAME}`)
    var json_req = req.body
    var token = {
        iv: json_req["doctor1"],
        content: json_req["doctor2"]
    }
    doctorAPI(token, json_req["src"], res).then((data) => {
        if (data == "true") {
            doctor(config.S2_NAME, config.S3_NAME).then((data) => {
                var secret = data
                var json_req_send = {
                    username: json_req.username,
                    sessionID: json_req.sessionID,
                    serviceID: json_req.serviceID,
                    physicalID: json_req.physicalID,
                    doctor1: secret.iv,
                    doctor2: secret.content,
                    src: config.S2_NAME
                }
                var image_config = {
                    username: json_req.username,
                    serviceID: json_req.serviceID,
                    os: json_req.os,
                }
                //Creating image with the following config
                createWithConfig(image_config).then((data) => {
                    var image_status = data
                    if (image_status == "true") {
                        console.info(color.FgGreen, "INFO : Image Build  succesfully")
                        //-------------------------------------------------------------------------------????
                        //send request to S3
                        //all from S1 - config +MakeFile send by S2 to S3
                        sendRequest(json_req_send, S3_IP, S3_Port, json_req.serviceID, sendMakeFile).then((data) => {
                            if (data == "true") {
                                console.info(color.FgGreen, "INFO : Request executed succesfully")
                                res.send("true")
                            } else {
                                console.info(color.FgGreen, "INFO : Request execution failure")
                                res.send("false")
                            }
                        }).catch((err) => {
                            console.error(color.FgRed, `ERROR : ${err}`)
                            console.info(color.FgGreen, "INFO : Request execution failure")
                            res.send("false")
                        })
                    } else {
                        console.info(color.FgRed, "ERROR : Image build fail")
                    }
                })


            }).catch((err) => {
                console.error(color.FgRed, `ERROR : ${err}`)
                console.info(color.FgGreen, "INFO : Request execution failure")
                res.send("false")
            })
        }
        //sendMakeFile(json_req.serviceID,S3_IP,S3_Port)
    }).catch((err) => {
        console.error(color.FgRed, `ERROR : ${err}`)
        res.send("false")
    })

})
//5d4a2315727d61ea103570c5e61fe603
//5d4a2315727d61ea103570c5e61fe603 
//5d4a2315727d61ea103570c5e61fe603
//5d4a2315727d61ea103570c5e61fe603
module.exports = router
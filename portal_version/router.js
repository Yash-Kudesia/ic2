const db = require("./database/auth_database");
const {doctor,doctorAPI} = require("./doctor.js")
const  {initialization} = require("./utils.js")
const  {sendRequest} = require("./request.js")
var express = require("express");
const authRequest = require("./auth");
var router = express.Router();
var config = require('./config')

const W1Port = config.W1_PORT;
const S1Port = config.S1_PORT;
const S1IP =  config.S1_IP;

// login user
router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {  
        authRequest(req.body.username,req.body.password,config.W1_NAME,req,res, initialization)     
    }else {
        res.send("Please fill the details")
    }
});

// route for dashboard
router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', { user: req.session.user })
    } else {
        res.send("Unauthorize User")
    }
})

// route for logout
router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.error(`ERROR : ${err}`);
            res.send("Error")
        } else {
            console.info(`INFO : ${req.session.user} logged out`);
            res.render('base', { title: "IC2", logout: "logout Successfully...!" })
        }
    })
})

// route for randomPC
router.post('/random', (req, res) => {
    if (req.session.user && req.session.password) {
        res.render('randomPC', { user: req.session.user })
    } else {
        res.send("Unauthorized access")
    }
})


//route for sending request
router.post('/randomClient', (req, res) => {
    if (req.body.password == req.session.password) {
        var os = req.body.os;
        //make a entry in doctor for the request
        var secret = doctor(config.W1_NAME, config.S1_NAME)
        //console.log("Secret token : " + Object.getOwnPropertyNames(secret) + "  -> " + secret.content)
        if (secret != null) {
            var json_req = {
                os: os,
                user: req.session.user,
                sessionID: req.session.token,
                port: W1Port,
                serviceID: req.session.token,
                src: config.W1_NAME,
                doctor1: secret.iv,
                doctor2: secret.content,
            }
            console.log(`Request to find random client genrated by ${req.session.user}`)
            //console.log(Object.getOwnPropertyNames(json_req) + "  <=>  " + typeof (json_req) + "  <=>  " + req.session.token)
            //send a request here to s1
            sendRequest(json_req, res, S1IP, S1Port)
        }
        else {
            console.error(`ERROR ${config.DOCTOR_NAME} not reponding, cannot make a request now`)
            //res.send("Server busy, try after some time")
            res.render('randomPC', { req_status: "Server busy, try after some time" })

        }
    } else {
        res.send("Unauthorized request")
    }
})

module.exports = router;
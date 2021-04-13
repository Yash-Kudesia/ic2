const db = require("./database/auth_database");
const { doctor, doctorAPI } = require("./doctor.js")
const { initialization } = require("./utils.js")
const { sendRequest } = require("./request.js")
var express = require("express");
const authRequest = require("./auth");
var router = express.Router();
var config = require('./config')

const W1Port = config.W1_PORT;
const S1Port = config.S1_PORT;
const S1IP = config.S1_IP;

// login user
router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        authRequest(req.body.username, req.body.password, config.W1_NAME, req, res, initialization)
    } else {
        res.render('base', { error: `Please fill all the details correctly` })
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
    var user = req.session.user
    req.session.destroy(function (err) {
        if (err) {
            console.error(`ERROR : ${err}`);
            res.send("Error")
        } else {
            console.info(`INFO : ${user} logged out`);
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

        doctor(config.W1_NAME, config.S1_NAME).then((data) => {
            var secret = data
            console.log("Secret token : " + Object.getOwnPropertyNames(secret) + "  -> " + secret.content)
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
                try {
                    sendRequest(json_req, res, S1IP, S1Port).then(() => {
                        console.info("INFO : Request forwarded for fetching client")
                    }).catch((err) => {
                        console.info(`ERROR : operational error - ${err}`)
                        res.render('randomPC', { reqStatus: "Some error in generating the request" })
                    })
                } catch (err) {
                    console.info(`ERROR : sending request error - ${err}`)
                    res.render('randomPC', { reqStatus: "Some error in generating the request" })
                }
            }
            else {
                console.error(`ERROR ${config.DOCTOR_NAME} not reponding, cannot make a request now`)
                //res.send("Server busy, try after some time")
                res.render('randomPC', { reqStatus: "Server busy, try after some time" })

            }
        }).catch((err) => {
            console.error(`ERROR : problem in secret generation in doctor -  ${err}`)
            res.render('randomPC', { reqStatus: "Some error in generating the request" })
        })

    } else {
        res.send("Unauthorized request")
    }
})

module.exports = router;
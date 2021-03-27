const db = require("./auth_database");
const docdb = require("./doctor_database");

var express = require("express");
var querystring = require('querystring');
var http = require('http');
const { v4: uuidv4 } = require("uuid");

var router = express.Router();

const { encrypt, decrypt } = require("./crypto")



// login user
router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        db.query('SELECT * from token WHERE Username = ?', [req.body.username], function (err, row, fields) {
            if (err) {
                console.log(err)
            }
            console.log(row);
            var u = row[0].Username;
            var p = row[0].Pasword;
            if (req.body.username == u && req.body.password == p) {
                req.session.user = u;
                req.session.password = p;
                req.session.token = row[0].token;
                initialization(req, res);
            }
        });

    } else {
        res.end("Invalid Username or password")
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
            console.log(err);
            res.send("Error")
        } else {
            res.render('base', { title: "IC2", logout: "logout Successfully...!" })
        }
    })
})
function generateToken(user, pass) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function initialization(req, res) {
    if (req.session.user) {
        if (req.session.token != null) {
            //prev token exist
            //check something
        }
        else {
            var token = generateToken(req.session.user, req.session.password);
            var sql = "UPDATE token SET Token = ? WHERE Username = ?";

            db.query(sql, [token, req.session.user], function (err, data) {
                if (err) {
                    // some error occured
                    console.log(err);
                } else {
                    // successfully inserted into db
                    req.session.token = token
                    res.render('dashboard', { token_status: "Token generated", token: token })
                }
            });
        }
    } else {
        res.send("Unauthorized access")
    }
}

// route for randomPC
router.post('/random', (req, res) => {
    if (req.session.user && req.session.password) {
        res.render('randomPC', { user: req.session.user })
    } else {
        res.send("Unauthorized access")
    }
})
function doctor(src, dest) {
    var sql = `INSERT INTO ${src} (TimeStamp,Token,Dest) VALUES(CURRENT_TIMESTAMP(),?,?)`
    var token = uuidv4();
    console.log("Token generated for registering with doctor")
    docdb.query(sql, [token, dest], function (err, row, fields) {
        if (err) {
            console.log(err)
            return null
        } else {
            console.log("Query registered with Doctor : " + token)
        }
    });
    return encrypt(token)
}

function sendRequest(json_req, res, host, port) {
    console.log("Sending query to " + json_req.src)
    var data = querystring.stringify(json_req);
    var options = {
        host: host,
        port: port,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    console.log("Preparing options for the HTTP request")
    var httpreq = http.request(options, function (response) {
        response.setEncoding('utf8');
        let resData = ''
        response.on('data', function (chunk) {
            console.log("body: " + chunk);
            resData += chunk
            
        });
        response.on('end', function () {
            //res.send(resData);
            if(resData=="true"){
                res.render('randomPC', { reqStatus: "Request authenticated and forwarded for processing" })
            }else{
                res.render('randomPC', { reqStatus: resData })
            }
        })
    });
    httpreq.write(data);
    httpreq.end();
}

//route for sending request
router.post('/randomClient', (req, res) => {
    if (req.body.password == req.session.password) {
        var os = req.body.os;
        //make a entry in doctor for the request
        var secret = doctor("w1", "s1")
        console.log("Secret token : " + Object.getOwnPropertyNames(secret) + "  -> " + secret.content)
        if (secret != null) {
            var json_req = {
                os: os,
                user: req.session.user,
                userToken: req.session.token,
                port: 3000,
                serviceToken: req.session.token,
                src: 'w1',
                doctor1: secret.iv,
                doctor2: secret.content
            }
            console.log(Object.getOwnPropertyNames(json_req) + "  <=>  " + typeof (json_req) + "  <=>  " + req.session.token)
            //send a request here to s1
            sendRequest(json_req, res, "localhost", 3002)
        }
        else {
            console.log("Doctor not reponding, cannot make a request now")
            //res.send("Server busy, try after some time")
            res.render('randomPC', { req_status: "Server busy, try after some time" })

        }
    } else {
        res.send("Unauthorized request")
    }
})

module.exports = router;
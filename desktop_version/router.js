const db = require("./database/nsm_database.js");
var express = require("express");
const path = require('path')
var router = express.Router();
var os = require('os');
var os_util = require('os-utils');
var fs = require('fs');
const findPort = require('find-open-port');
const exec = require('child_process').exec;
const { doctor, 
    file_transfer_Check, 
    data_transfer_check, 
    doctorFileTranfer } = require("./doctor.js")

function generateToken(user, pass) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var getHash = (content) => {
    var hash = crypto.createHash('md5');
    //passing the data to be hashed
    data = hash.update(content, 'utf-8');
    //Creating the hash in the required format
    gen_hash = data.digest('hex');
    return gen_hash;
}

//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------


// login user
router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        db.query('SELECT * from client_details WHERE Username = ?', [req.body.username], function (err, row, fields) {
            if (err) {
                console.log(err)
            }
            console.log(row);
            if (row.length == 0) {
                res.render('base', { title: "IC2", error: "Invalid Username or Password" })
            } else {
                var u = row[0].Username;
                var p = row[0].Password;
                if (req.body.username == u && req.body.password == p) {
                    req.session.user = u;
                    req.session.password = p;
                    req.session.token = row[0].token;

                    res.redirect('/route/dashboard');

                }
            }

        });

    } else {
        res.render('base', { title: "IC2", error: "Invalid Username or Password" })
    }
});

// route for dashboard
router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', { user: req.session.user })
    } else {
        res.render('base', { title: "IC2", error: "Unauthorized access" })
    }
})

// route for logout
router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.render('base', { title: "IC2", error: "Some error while logging out" })
        } else {
            res.render('base', { title: "IC2", logout: "logout Successfully...!" })
        }
    })
})

//route for token initialization
router.post('/init', (req, res) => {

    if (req.session.user) {
        if (req.session.token != null) {
            //prev token exist
            //check something
        }
        else {
            var token = generateToken(req.session.user, req.session.password);
            var sql = "UPDATE client_details SET ClientID = ? WHERE Username = ?";
            var sql2 = "UPDATE client_status SET LiveSince = CURRENT_TIMESTAMP(),Live = ?,Busy = ? WHERE Username = ?"
            db.query(sql, [token, req.session.user], function (err, data) {
                if (err) {
                    // some error occured
                    res.render('dashboard', { title: "IC2", error: "Some error in making the Client Live" })
                }
            });
            db.query(sql2, [1, 0, req.session.user], function (err, data) {
                if (err) {
                    // some error occured
                    res.render('dashboard', { title: "IC2", error: "Some error in making the Client Live" })
                } else {
                    // successfully inserted into db
                    res.render('dashboard', { token_status: "Token/ClientID generated and the Client is Live", token: token, user: req.session.user })
                }
            });
        }
    } else {
        res.render('base', { title: "IC2", error: "Unauthorized access" })
    }
});

//giving back the health status
router.post('/health', (req, res) => {
    const myShellScript = exec('sh status/health_check.sh /status');
    myShellScript.stdout.on('data', (data) => {
        console.log(data);
        // do whatever you want here with data
        if (data == "ok") {
            res.send("true")
        }
    });
    myShellScript.stderr.on('data', (data) => {
        console.error(data);
        res.send("false")
    });

})

//giving back the available port
router.post('/port', (req, res) => {
    findPort().then(port => {
        res.send(port)
        console.log(`Containers will be run on %d.${port}`);
    });
})

//recieve the Makefile from S3 to run on the machine
router.post('/file', (req, res) => {
    var filename = path.resolve(__dirname, "MakeFile_S3");
    var dst = fs.createWriteStream(filename);
    req.pipe(dst);
    dst.on('drain', function () {
        console.log('drain', new Date());
        req.resume();
    });
    req.on('end', function () {
        //create hash from the file
        var rs = fs.createReadStream(fileName);

        var rContents = '' // to hold the read contents;
        rs.on('data', function (chunk) {
            rContents += chunk;
        });
        rs.on('end', function () {
            console.log('sent to ' + target);
            var content = getHash(rContents);
            console.log("Hash of the file generated, to be sent to doctor for verification")
            file_transfer_Check(req.session.serviceID, "s3", res, content)
            res.send("ok");
        });
    });
});

router.post('/command', (req, res) => {
    if (req.session.user) {
        var json_req = req.body;
        var token = {
            iv: json_req["doctor1"],
            content: json_req["doctor2"]
        }
        data_transfer_check(token, json_req.src, res);
        req.session.serviceID = json_req.serviceID
        req.session.command = json_req.command
    } else {
        res.send("Unauthorized request")
    }
});
module.exports = router
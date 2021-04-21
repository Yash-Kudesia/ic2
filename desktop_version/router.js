const db = require("./database/nsm_database.js");
var express = require("express");
const path = require('path')
var router = express.Router();
var fs = require('fs');
const findPort = require('find-open-port');
const exec = require('child_process').exec;
var address = require('address');
const { doctor,
    file_transfer_Check,
    data_transfer_check,
    doctorFileTranfer } = require("./doctor.js")
const config = require('./config')
const crypto = require("crypto")
const client_machine_ip = config.C2_IP;
var client_machine_mac = null
address.mac(function (err, addr) {
    if (err) console.log(err)
    client_machine_mac = addr
});

function getENV(){
    console.info(`GET ENV CALLED`)
    //console.info(color.FgYellow,`GET ENV ${Object.getOwnPropertyNames(process.env.active_service)}`)
    var s = process.env.active_service.split(",")
    if(s.length>0){
        var ele = s.shift()
        process.env.active_service = s.join()
        if(process.env.archive_service){
            var s1 = process.env.archive_service
            s1+=","+ele
            process.env.archive_service = s1
        }else{
            var s2 = ele
            process.env.archive_service = s2
        }
        return ele
    }else{
        return null
    }
}
function setENV(id){
    console.info(`SET ENV CALLED`)
    if(process.env.active_service){
        var s = process.env.active_service
        s+=","+id
        process.env.active_service = s
        //console.info(color.FgYellow,`SET new append ${id}`)
    }else{
        var s = id
        process.env.active_service = s
        //console.info(color.FgYellow,`SET new init ${id}`)
    }
}


function generateToken(user, pass) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var getHash = (content) => {
    try {
        var hash = crypto.createHash('md5');
        //passing the data to be hashed
        data = hash.update(content, 'utf-8');
        //Creating the hash in the required format
        gen_hash = data.digest('hex');
        return gen_hash;
    } catch (err) {
        console.error(`ERROR : ${err}`)
        return null
    }
}
async function updateDB(u, pass) {
    try {
        db.query('INSERT INTO client_ip_table (PhysicalID,IP) VALUES (?,?)',
            [client_machine_mac, client_machine_ip], function (err, row, fields) {
                if (err) {
                    console.error(`ERROR : ${err}`)
                } else {
                    console.info(`INFO : Physical ID and IP updated in IP Table for ClientID - ${u}`)
                }
            })
        db.query('UPDATE client_details SET PhysicalID=?,IP=? WHERE Username=?',
            [client_machine_mac, client_machine_ip, u], function (err, row, fields) {
                if (err) {
                    console.error(`ERROR : ${err}`)
                } else {
                    console.info(`INFO : Physical ID and IP updated in Client Details Table for ClientID - ${u}`)
                }
            })
        db.query('UPDATE client_status SET PhysicalID=? WHERE Username=?',
            [client_machine_mac, u], function (err, row, fields) {
                if (err) {
                    console.error(`ERROR : ${err}`)
                } else {
                    console.info(`INFO : Physical ID and IP updated in Client Status Table for Client ID - ${u}`)
                }
            })
    } catch (err) {
        console.error(`ERROR : ${err}`)
    }
}


function runFILE(filename){
    findPort().then(port => {
        console.info(`INFO : Containers will run on ${port}`);
        var command = `PORT=6080 PORT1=6082 make -f ${filename} run`
        const myShellScript = exec(command);
        myShellScript.stdout.on('data', (data) => {
            console.info(`INFO : ${data}`);
        });
        myShellScript.stdout.on('end', () => {
            console.info(`INFO : Command executed`);
        });
        myShellScript.stderr.on('data', (data) => {
            console.error(`ERROR : ${data}`)
        });
    }).catch((err) => {
        console.error(`ERROR : ${err}`)
    });
}


//---------------------------------------------------------------------------------------
//      routes for client
//---------------------------------------------------------------------------------------


// login user
router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        db.query('SELECT * from client_details WHERE Username = ?', [req.body.username], function (err, row, fields) {
            if (err) {
                console.error(`ERROR : ${err}`)
                res.render('base', { title: "IC2", error: "Error occured during login" })
            } else {
                if (row.length == 0) {
                    console.error(`ERROR : No records found for ${req.body.username}`)
                    res.render('base', { title: "IC2", error: "No such user found" })
                } else {
                    var u = row[0].Username;
                    var p = row[0].Password;
                    if (req.body.username == u && req.body.password == p) {
                        req.session.user = u;
                        req.session.password = p;
                        req.session.token = row[0].token;
                        updateDB(u, p)
                        res.redirect('/route/dashboard');
                    } else {
                        console.error(`ERROR : Wrong password for ${req.body.username}`)
                        res.render('base', { title: "IC2", error: "Password do not match" })
                    }
                }
            }
        });

    } else {
        res.render('base', { title: "IC2", error: "fill the details properly" })
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
            console.error(`ERROR : ${err}`)
            res.render('base', { title: "IC2", error: "Some error while logging out" })
        } else {
            console.info(`INFO : User logged out and session destroyed`)
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
            try {
                var token = generateToken(req.session.user, req.session.password);
                var sql = "UPDATE client_details SET ClientID = ? WHERE Username = ?";
                var sql2 = "UPDATE client_status SET LiveSince = CURRENT_TIMESTAMP(),Live = ?,Busy = ? WHERE Username = ?"
                db.query(sql, [token, req.session.user], function (err, data) {
                    if (err) {
                        console.error(`ERROR : ${err}`)
                        res.render('dashboard', { title: "IC2", error: "Some error in making the Client Live" })
                    } else {
                        console.info(`INFO : Token/ClientID inserted in DB for - ${req.session.user}`)
                        db.query(sql2, [1, 0, req.session.user], function (err, data) {
                            if (err) {
                                console.error(`ERROR : ${err}`)
                                res.render('dashboard', { title: "IC2", error: "Some error in making the Client Live" })
                            } else {
                                console.info(`INFO : Flags updated in DB for - ${req.session.user}`)
                                res.render('dashboard', { token_status: "Token/ClientID generated and the Client is Live", token: token, user: req.session.user })
                            }
                        });
                    }
                });
            } catch (err) {
                console.error(`ERROR : ${err}`)
            }
        }
    } else {
        res.render('base', { title: "IC2", error: "Unauthorized access" })
    }
});



//------------------------------------------------------------------------------------------
//  routes for internal communication
//------------------------------------------------------------------------------------------




//giving back the health status
router.post('/health', (req, res) => {
    // try {
    //     var filename = path.resolve("./", "health_output.txt");
    //     console.info(`INFO : Get Heath Check request on ${config.C2_NAME}`)
    //     console.info(`INFO : Filename is  ${filename}`)
    //     const myShellScript = exec('sh status/health_check.sh');
    //     myShellScript.stdout.on('data', (data) => {
    //         console.info(`INFO : ${data}`);
    //         var rs = fs.createReadStream("/home/prince/ic2/ic2/dockerRun/health_output.txt");
    //         var rContents = '' // to hold the read contents;
    //         rs.on('data', function (chunk) {
    //             rContents += chunk;
    //         });
    //         rs.on('end', function () {
    //             if (rContents == " OK ") {
    //                 res.send("true")
    //             } else {
    //                 res.send("false")
    //             }
    //         });
    //     });
    //     myShellScript.stderr.on('data', (data) => {
    //         console.error(`ERROR : ${data}`)
    //         res.send("false")
    //     });
    // } catch (err) {
    //     console.error(`ERROR : ${err}`)
        
    // }
    res.send("true")
})

//giving back the available port
router.post('/port', (req, res) => {
    console.info(`INFO : Get Port request on ${config.C2_NAME}`)
    findPort().then(port => {
        res.send(port)
        console.info(`INFO : Containers will run on %d.${port}`);
    }).catch((err) => {
        console.error(`ERROR : ${err}`)
    });
})

//recieve the Makefile from S3 to run on the machine
router.post('/file', (req, res) => {
    console.info(`INFO : File recieve request on ${config.C2_NAME}`)
    try {
        // var tmp = getENV()
        // if(tmp!=null){
        //     if(req.session.serviceID!=null){
        //         req.session.serviceID = tmp
        //     }
        // }
        var filename = path.resolve(__dirname, `makefiles/Makefile_BY_S3`);
        console.info(`INFO : Saving file with name - ${filename}`)
        var dst = fs.createWriteStream(filename);
        req.pipe(dst);
        dst.on('drain', function () {
            console.info(`INFO : data drain on file recieve request - ${new Date()}`);
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
                console.log('INFO : File Recieved');
                var content = getHash(rContents);
                if (content != null) {
                    console.log(`INFO : Hash of file generated, sending to ${config.DOCTOR_NAME} for verification`)
                    var param =[filename]
                    file_transfer_Check(req.session.serviceID, config.S3_NAME, res, content, param,runFILE).then((data) => {
                        console.info('INFO : File recieved is verified')
                        //now populate the makfile and run the file recived
                       res.send("true")
                    }).catch((err) => {
                        console.error(`ERROR : ${err}`)
                        res.send('False')
                    });
                } else {
                    console.log(`ERROR : Hash of file is null`)
                }
            });
        });
    } catch (err) {
        console.error(`ERROR : ${err}`)
    }
});


router.post('/details',(req,res)=>{
    console.info(`INFO : User details recieved on ${config.C2_NAME}`)
    if (req.session.user) {
        var json_req = req.body;
        var token = {
            iv: json_req["doctor1"],
            content: json_req["doctor2"]
        }
        data_transfer_check(token, json_req.src, res).then((data) => {
            console.info(`INFO : Data transfer check status ${data}`)
            req.session.serviceID = json_req.serviceID
            setENV(json_req.serviceID)
            console.info(`INFO : Received user details with serviceID ${req.session.serviceID}`)
            res.send("true")
        }).catch((err) => {
            console.error(`ERROR : ${err}`)
            res.send('false')
        });

    } else {
        res.send("false")
    }
})


router.post('/command', (req, res) => {
    console.info(`INFO : Request for command to run the file recieved on ${config.C2_NAME}`)
    if (req.session.user) {
        var json_req = req.body;
        var token = {
            iv: json_req["doctor1"],
            content: json_req["doctor2"]
        }
        data_transfer_check(token, json_req.src, res).then(() => {
            req.session.serviceID = json_req.serviceID
            req.session.command = json_req.command
        }).catch((err) => {
            console.error(`ERROR : ${err}`)
            res.send('False')
        });

    } else {
        res.send("Unauthorized request")
    }
});
module.exports = router
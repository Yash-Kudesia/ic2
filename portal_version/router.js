const db = require("./databse.js");
var express = require("express");
const { route } = require("../desktop_version/router.js");
var router = express.Router();


// login user
router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        db.query('SELECT * from token', function (err, row, fields) {
            if (err) {
                console.log(err)
            }
            console.log(row);
            var u = row[0].Username;
            var p = row[0].Pasword;
            if (req.body.username == u && req.body.password == p) {
                req.session.user =u;
                req.session.password = p;
                req.session.token = row[0].token;
                initialization(req,res);
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
function generateToken(user,pass){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
}
function initialization(req,res){
    if (req.session.user) {
        if (req.session.token!=null) {
            //prev token exist
            //check something
        }
        else {
            var token = generateToken(req.session.user,req.session.password);
            var sql = "UPDATE token SET Token = ? WHERE Username = ?";

            db.query(sql, [token,req.session.user], function (err, data) {
                if (err) {
                    // some error occured
                    console.log(err);
                } else {
                    // successfully inserted into db
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
        res.render('randomPC',{user:req.session.user})
    } else {
        res.send("Unauthorized access")
    }
})

//route for sending request
router.post('/randomPC',(req,res)=>{
    if(req.body.password==req.session.password){
        var os = req.body.os;
        var json_req = {
            'os' : os,
            'user':req.session.user,
            'userToken':req.session.token,
            'port':3000,
            'serviceToken':req.session.token
        }
        //send a request here



    }else{
        res.send("Unauthorized request")
    }
})

module.exports = router;
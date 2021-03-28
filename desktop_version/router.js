const db = require("./databse.js");
var express = require("express");
var router = express.Router();
var os = require('os');
var os_util = require('os-utils');



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
function generateToken(user, pass) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


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

module.exports = router
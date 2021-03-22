const db = require("./databse.js");
var express = require("express");
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

                res.redirect('/route/dashboard');
               
            }
        });
        // db.execute("Select * from token").then(([row,metaData])=>{

        // }).catch((err)=>{
        //     console.log(err);
        // });
        //res.end("Login Successful...!");
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
//route for token initialization
router.post('/init', (req, res) => {
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
                    res.render('dashboard', { token_status: "Token generated", token: token,user:req.session.user })
                }
            });
        }
    } else {
        res.end("Unauthorized access")
    }
});

module.exports = router;
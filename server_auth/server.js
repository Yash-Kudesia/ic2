const express = require('express');
const app = express();
const db = require("./database/database.js");
const { encrypt, decrypt } = require('./crypto');
const { doctor, doctorAPI } = require('./doctor')
const port = process.env.PORT || 3006;

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

function authenticate(req, res,password) {

    db.query('SELECT * from token WHERE Username = ?', [req.user], function (err, row, fields) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(row);
            var u = row[0].Username;
            var p = row[0].Pasword;
            console.log("Credentials from Request "+req.user+"  ,"+password)
            if (req.user == u && password == p) {
                res.send("True")
            } else {
                res.send("False")
                res.end()
            }
        }
    });
}

// home route
app.post('/', (req, res) => {
    var json_req = req.body
    console.log("Request received at Auth API")
    var token = {
        iv: json_req.doctor1,
        content: json_req.doctor2
    }
    var password = {
        iv: json_req.auth1,
        content: json_req.auth2
    }
    doctorAPI(token, json_req.source)


    var password = decrypt(password)
    authenticate(json_req,res, password)
})


app.listen(port, () => { console.log(`Auth Server listening on http://localhost:${port}`) });
//npm start --authDB=192.168.1.1
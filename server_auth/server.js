const express = require('express');
const app = express();
const db = require("./database.js");
const { encrypt, decrypt } = require('./crypto');
const  {doctor,doctorAPI} = require('./doctor')
const port = process.env.PORT || 8080;

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

function authenticate(req,password) {

    db.query('SELECT * from token WHERE Username = ?', [req.body.username], function (err, row, fields) {
        if (err) {
            console.log(err)
        }
        console.log(row);
        var u = row[0].Username;
        var p = row[0].Pasword;
        if (req.username== u && password == p) {
            res.send("True")
        } else {
            res.send("False")
            res.end()
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
        iv:json_req.auth1,
        content:json_req.auth2
    }
    var token = decrypt(token)
    doctorAPI(token,json_req.source,'a')


    var password = decrypt(password)
    authenticate(json_req,password)
})


app.listen(port, () => { console.log(`Auth Server listening on http://localhost:${port}`) });
//npm start --authDB=192.168.1.1
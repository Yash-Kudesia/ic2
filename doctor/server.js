const express = require('express');
var querystring = require('querystring');
const app = express();
const db = require("./database.js");
const { encrypt, decrypt } = require('./crypto');

const port = process.env.PORT || 3005;



app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

function authenticate(tablename, destination, token, res) {
    var sql = `Select * from ${tablename} where Token = ? and Dest = ?`
    console.log("SQL in doctor : "+sql)
    console.log("Descrypted token at doctor " + token)
    db.query(sql, [token,destination],function (err, row, fields) {
        if (err) {
            console.log(err)
            res.send("false")
        }
        if (row.length > 0) {
            res.send("true")
        }else{
            res.send("false")
            console.log("found nothing in DB")
        }
    });
    //res.send("false")
}

// home route
app.post('/', (req, res) => {
    var json_req = req.body
    console.log("Request received at doctor")

    var token = {
        iv: json_req.doctor1,
        content: json_req.doctor2
    }
    var token = decrypt(token)
    authenticate(json_req.source, json_req.dest, token, res)
})


app.listen(port, ()=>{ console.log(`Doctor listening on http://localhost:${port}`)});
const express = require('express');
var querystring = require('querystring');
var http = require('http');
const app = express();
const service_db = require("./service_database");
const nsm_db = require("./nsm_database");
const doctor_db = require("./doctor_database");

const { encrypt, decrypt } = require("./crypto")

const port = process.env.PORT || 3002;

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

function fetchData(username) {
    var sql = "Select Physical_ID from (Select PhysicalID,(Total_Memory-Memory_Usage) as P1,(Total_CPU - CPU_Usage) as P2 from nsm WHERE Live = 1 and Busy = 0) as Temp ORDER BY P1 DESC,P2 ASC"
    service_db.query(sql, [username, 1, 0], function (err, row, fields) {
        if (err) {
            console.log(err)
            return null
        }
        else {
            if (row.length > 0) {
                var details = row[0];
                return details.PhysicalID
            }
            else {
                return null
            }
        }
    });
}

// function fetchServiceID(username){

// }


function doctor(src, dest) {
    var sql = `INSERT INTO ${src} (TimeStamp,Token,Dest) VALUES(CURRENT_TIMESTAMP(),?,?)`
    var token = uuidv4();

    doctor_db.query(sql, [token, dest], function (err, row, fields) {
        if (err) {
            console.log(err)
            return null
        }
    });
    return encrypt(token)
}

function doctorAPI(token, src, res) {
    var json_req = {
        doctor1: token.iv,
        doctor2: token.content,
        source: src,
        dest: "s1"
    }
    console.log("Verifying the request from " + src + " on s1")
    var data = querystring.stringify(json_req);

    var options = {
        host: 'localhost',
        port: 3005,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var httpreq = http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log("Reponse from Doctor in S1 : " + chunk)
            if (chunk == "true") {
                //means request is true
                res.send("true")
            } else {
                res.send("false")
            }
        });
        response.on('end', function () {
            console.log("Doctor verified the incoming request")
        })
    });
    httpreq.write(data);
    httpreq.end();
}

// home route
app.post('/', (req, res) => {
    //run the doctor here
    console.log("Request received at S1 : " + Object.getOwnPropertyNames(req.body))
    // var json_req = JSON.parse(req.body)
    var json_req = req.body
    var token = {
        iv: json_req["doctor1"],
        content: json_req["doctor2"]
    }
    doctorAPI(token, json_req["src"], res)
    //perform all three steps of S1 here
    //    var physicalID = fetchData(req.user);
    //     var json_req = {
    //         'username':req.username,
    //         'sessionID':req.sessionID,
    //         'os':req.os,
    //         'physicalID':physicalID
    //     }

    //send the request here to S2
})

app.listen(port, () => { console.log("Listening to the server on http://localhost:3002") });

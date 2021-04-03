const { doctor, doctorAPI } = require('./doctor')
const { encrypt, decrypt } = require('./crypto')

const querystring = require('querystring')
const http = require('http')
const auth_ip = "localhost"
const authPort = 3006

function authRequest(username, password,src,req,res,init_callback) {
    var pass = encrypt(password)
    var secret = doctor(src, 'a')
    console.log("Auth called")
    var json_req = {
        user: username,
        auth1: pass.iv,
        auth2: pass.content,
        doctor1: secret.iv,
        doctor2: secret.content,
        type:"data",
        source:src
    }
    return sendTOAuth(json_req,req,res,init_callback)
}


function sendTOAuth(json_req,req,res,init_callback) {
   
    console.log("Authenticating the user")
    var data = querystring.stringify(json_req);
    var options = {
        host: auth_ip,
        port: authPort,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    var resData = ''
    var httpreq = http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log("Reponse from Auth Server in W1 : " + chunk)
            resData = chunk
        });
        response.on('end', function () {
            if (resData=="True"){
                req.session.user = req.body.username;
                req.session.password = req.body.password;
                init_callback(req,res)
                console.log("Auth Server verified the incoming request")
            }else{
                res.send("User not authenticated")
            }
        })
    });
    httpreq.write(data);
    httpreq.end();
}

module.exports = authRequest
const { doctor, doctorAPI } = require('./doctor')
const { encrypt, decrypt } = require('./crypto')

const querystring = require('querystring')
const http = require('http')
var config = require('./config')
const auth_ip = config.AUTH_IP
const authPort = config.AUTH_PORT

function authRequest(username, password,src,req,res,init_callback) {
    var pass = encrypt(password)
    var json_req = {
        user: username,
        auth1: pass.iv,
        auth2: pass.content,
        doctor1: "",
        doctor2: "",
        type:"data",
        source:src
    }
    var param = [json_req,req,res,init_callback]
    doctor(src, 'a',param,sendTOAuth)

}


function sendTOAuth(json_req,req,res,init_callback) {
   
    console.info(`INFO : Authenticating the user - ${json_req.user}`)
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
                console.info("INFO : User is authenticated successfully")
                console.info("INFO : Initializing via Callbacks")
                init_callback(req,res)
            }else{
                console.info(`INFO : ${json_req.user} User details not found or incorrect`)
                res.send(`Credentials not found for ${json_req.user}`)
            }
        })
    });
    httpreq.write(data);
    httpreq.end();
}

module.exports = authRequest
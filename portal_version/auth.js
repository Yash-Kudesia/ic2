const { doctor, doctorAPI } = require('./doctor')
const { encrypt, decrypt } = require('./crypto')
const auth_ip = "localhost"
const authPort = 3006

function authRequest(username, password,src) {
    var pass = encrypt(password)
    var secret = doctor(src, 'a')

    var json_req = {
        user: username,
        auth1: pass.iv,
        auth2: pass.content,
        doctor1: secret.iv,
        doctor2: secret.content,
        type:"data",
        source:src
    }
    return sendTOAuth(json_req)
}


function sendTOAuth(json_req) {
   
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
    var httpreq = http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log("Reponse from Auth Server in W1 : " + chunk)
            if (chunk == "true") {
                //means request is true
                return true
            } else {
               return false
            }
        });
        response.on('end', function () {
            console.log("Doctor verified the incoming request")
        })
    });
    httpreq.write(data);
    httpreq.end();
}

module.exports = authRequest
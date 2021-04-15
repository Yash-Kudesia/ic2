const http = require('http');
const { resolve } = require('path');
var querystring = require('querystring');
var config = require('./config')

function sendRequest(json_req, res, host, port) {
    return new Promise((resolve, reject) => {
        try {
            console.info(`INFO : Sending Request from ${config.W1_NAME} to ${host}:${port}`);
            var data = querystring.stringify(json_req);
            var options = {
                host: host,
                port: port,
                path: '/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(data)
                }
            };
            console.info(`INFO : Preparing the HTTP request for ${host}:${port}`)
            var httpreq = http.request(options, function (response) {
                response.setEncoding('utf8');
                let resData = ''
                response.on('data', function (chunk) {
                    //console.log("body: " + chunk);
                    resData += chunk

                });
                response.on('end', function () {
                    //res.send(resData);
                    if (resData == "true") {
                        console.info(`INFO : Request sent and recieved true status from ${host}:${port}`)
                        res.render('state', {user:json_req.user, reqStatus: "Request authenticated and forwarded for processing" })
                        resolve("true")
                    } else {
                        res.render('state', {user:json_req.user, reqStatus: "Server error" })
                        console.error("ERROR : " + resData)
                        resolve("false")
                    }
                })
            });
            
              
            httpreq.write(data);
            httpreq.on('error', function(error) {
                reject(error)
            });
            httpreq.end();
           
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = { sendRequest }
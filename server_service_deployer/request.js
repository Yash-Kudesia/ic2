var querystring = require('querystring');
const http = require('http')
var color = require("./status_color")
var config = require("./config")
function sendRequest(json_req, host, port, path = "/") {
    return new Promise((resolve, reject) => {
        try {
            console.info(color.FgGreen,`INFO : Sending Request from ${config.S3_NAME} to ${host}:${port}`);
            var data = querystring.stringify(json_req);
            var options = {
                host: host,
                port: port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(data)
                }
            };
            console.info(color.FgGreen,`INFO : Preparing the HTTP request for ${host}:${port}`)
            var httpreq = http.request(options, function (response) {
                response.setEncoding('utf8');
                let resData = ''
                response.on('data', function (chunk) {
                    resData += chunk

                });
                response.on('end', function () {
                    //res.send(resData);
                    if (resData == "true") {
                        console.info(color.FgGreen,`INFO : Sent Request status recieved true from ${host}:${port}`)
                        resolve("true")
                    } else {
                        console.error(color.FgRed,`ERROR : Sent Request status recieved false from ${host}:${port}`)
                        resolve("false")
                    }
                })
            });
            httpreq.write(data);
            httpreq.on('error', function (error) {
                reject(error)
            });
            httpreq.end();
        } catch (err) {
            reject(err)
        }
    })
}


module.exports = sendRequest
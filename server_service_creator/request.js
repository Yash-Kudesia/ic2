var querystring = require('querystring');
const http = require('http')
var config = require('./config')
var color = require('./status_color')
function sendRequest(json_req, host, port, serviceID, callback, res = null) {
    return new Promise((resolve, reject) => {
        try {
            console.info(color.FgGreen,`INFO : Sending Request from ${config.S2_NAME} to ${host}:${port}`);
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
            console.info(color.FgGreen,`INFO : Preparing the HTTP request for ${host}:${port}`)
            var httpreq = http.request(options, function (response) {
                response.setEncoding('utf8');
                let resData = ''
                response.on('data', function (chunk) {
                    resData += chunk

                });
                response.on('end', function () {
                    //res.send(resData);
                    if (res != null) {
                        if (resData == "true") {
                            resolve("true")
                        } else {
                            resolve("false")
                        }
                    } else {
                        console.info(color.FgGreen,`INFO : Request Response from ${host}:${port} in ${config.S2_NAME}:${resData}`)
                        if (resData == "true") {
                            callback(serviceID, config.S3_IP, config.S3_PORT)
                            resolve("true")
                        }else {
                            resolve("false")
                        }
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
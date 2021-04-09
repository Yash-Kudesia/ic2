const http = require('http');
var querystring = require('querystring');
var config = require('./config')

function sendRequest(json_req, res, host, port) {
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
    console.log(`INFO : Preparing the HTTP request for ${host}:${port}`)
    var httpreq = http.request(options, function (response){
        response.setEncoding('utf8');
        let resData = ''
        response.on('data', function (chunk) {
            console.log("body: " + chunk);
            resData += chunk
            
        });
        response.on('end', function () {
            //res.send(resData);
            if(resData=="true"){
                res.render('randomPC', { reqStatus: "Request authenticated and forwarded for processing" })
            }else{
                res.render('randomPC', { reqStatus: "Server error" })
                console.error("ERROR : "+resData)
            }
        })
    });
    httpreq.write(data);
    httpreq.end();
}

module.exports = {sendRequest}
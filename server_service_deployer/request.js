var querystring = require('querystring');
const http = require('http')
function sendRequest(json_req, host, port,path="/") {
    console.info(`INFO : Sending Request from ${config.S3_NAME} to ${host}:${port}`);
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
    console.info(`INFO : Preparing the HTTP request for ${host}:${port}`)
    var httpreq = http.request(options, function (response) {
        response.setEncoding('utf8');
        let resData = ''
        response.on('data', function (chunk) {
            resData += chunk
            
        });
        response.on('end', function () {
            //res.send(resData);
            if(resData=="true"){
                console.info(`INFO : Sent Request status recieved true from ${host}:${port}`)
                return resData
            }else{
                console.error(`ERROR : Sent Request status recieved false from ${host}:${port}`)
                return "false"
            }
        })
    });
    httpreq.write(data);
    httpreq.end();
}


module.exports = sendRequest
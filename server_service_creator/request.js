var querystring = require('querystring');
const http = require('http')
var config = require('./config')

function sendRequest(json_req, host, port,serviceID,callback,res=null) {
    console.info(`INFO : Sending Request from ${config.S2_NAME} to ${host}:${port}`);
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
            resData += chunk
            
        });
        response.on('end', function () {
            //res.send(resData);
            if(res!=null){
                if(resData=="true"){
                    console.info(`INFO : Sent Request status recieved true from ${host}:${port}`)
                    res.send("true")
                }else{
                    console.error(`ERROR : Sent Request status recieved false from ${host}:${port}`)
                    res.send("false")
                }
            }else{
                console.info(`INFO : Request Response from ${host}:${port} in ${config.S2_NAME}:${resData}`)
                if(resData=="true"){
                    callback(serviceID,config.S3_IP,config.S3_PORT)
                }
            }
        })
    });
    httpreq.write(data);
    httpreq.end();
}


module.exports = sendRequest
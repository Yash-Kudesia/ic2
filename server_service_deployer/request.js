var querystring = require('querystring');

function sendRequest(json_req, host, port,path="/") {
    console.log("Sending query to " + json_req.src)
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
    console.log("Preparing options for the HTTP request")
    var httpreq = http.request(options, function (response) {
        response.setEncoding('utf8');
        let resData = ''
        response.on('data', function (chunk) {
            console.log("body: " + chunk);
            resData += chunk
            
        });
        response.on('end', function () {
            //res.send(resData);
            if(resData=="true"){
                return resData
            }else{
                return "false"
            }
        })
    });
    httpreq.write(data);
    httpreq.end();
}


module.exports = sendRequest
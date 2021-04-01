var querystring = require('querystring');
const http = require("http");
function sendRequest(json_req, res, host, port) {
    console.log("Sending query to " + json_req.src)
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
                res.render('randomPC', { reqStatus: "Request authenticated and forwarded for processing" })
            }else{
                res.render('randomPC', { reqStatus: resData })
            }
        })
    });
    httpreq.write(data);
    httpreq.end();
}


module.exports = sendRequest
var querystring = require('querystring');
const http = require("http");
function sendRequest(json_req, host, port,res=null) {
    console.log("Sending query from " + json_req.src)
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
            if(res!=null){
                if(resData=="true"){
                    res.render('randomPC', { reqStatus: "Request authenticated and forwarded for processing" })
                }else{
                    res.render('randomPC', { reqStatus: resData })
                }
            }else{
                console.log(resData)
            }
        })
    });
    httpreq.write(data);
    httpreq.end();
}


module.exports = sendRequest
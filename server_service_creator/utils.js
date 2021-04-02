const fs = require('fs');
const path = require('path');
const request = require('request');

function sendFile(IP,port){
    var fileName = "Makefile_S2"
    var target = `http://${IP}:${port}/`
    var rs = fs.createReadStream(fileName);
    var ws = request.post(target);
    
    ws.on('drain', function () {
      console.log('drain', new Date());
      rs.resume();
    });
    rs.on('end', function () {
      console.log('sent to ' + target);
    });
    ws.on('error', function (err) {
      console.error('cannot send file to ' + target + ': ' + err);
    });
    
    rs.pipe(ws);
}

function sendtoClientMakeFile(IP,port){
    sendFile(IP,port)
}

module.exports = {
    sendtoClientMakeFile
}
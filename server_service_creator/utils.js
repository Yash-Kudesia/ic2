const fs = require('fs');
const path = require('path');
const request = require('request');
var crypto = require('crypto');
const {doctor,doctorAPI,doctorFileTranfer} = require("./doctor.js")
var config = require("./config")

var getHash = ( content ) => {				
  var hash = crypto.createHash('md5');
  //passing the data to be hashed
  data = hash.update(content, 'utf-8');
  //Creating the hash in the required format
  gen_hash= data.digest('hex');
  return gen_hash;
}


function sendFile(serviceID,IP,port){
    var fileName = path.resolve(__dirname, "Makefile");
    var target = `http://${IP}:${port}/file`
    var rs = fs.createReadStream(fileName);
    var ws = request.post(target);
    
    ws.on('drain', function () {
      console.log('drain', new Date());
      rs.resume();
    });
    var rContents = '' // to hold the read contents;
    rs.on('data', function(chunk) {
        rContents += chunk;
    });
    rs.on('end', function () {
      console.log('sent to ' + target);
      var content = getHash(rContents) ;
      console.info(`ERROR : Hash of the file generated, to be sent to ${config.S3_NAME}`)
      doctorFileTranfer(config.S2_NAME,config.S3_NAME,content,serviceID)

    });
    ws.on('error', function (err) {
      console.error('ERROR : cannot send file to ' + target + ': ' + err);
    });
    
    rs.pipe(ws);
}

function sendMakeFile(serviceID,IP,port){
    sendFile(serviceID,IP,port)
}

module.exports = {
  sendMakeFile
}
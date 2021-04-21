const fs = require('fs');
const path = require('path');
const request = require('request');
var crypto = require('crypto');
const { doctor, doctorAPI, doctorFileTranfer } = require("./doctor.js")

var config = require("./config")
var color = require('./status_color')
var getHash = (content) => {
  try {
    var hash = crypto.createHash('md5');
    //passing the data to be hashed
    data = hash.update(content, 'utf-8');
    //Creating the hash in the required format
    gen_hash = data.digest('hex');
    return gen_hash;
  } catch (err) {
    console.error(color.FgRed, `ERROR : ${err}`)
    return null
  }
}

function makeEntry(serviceID) {
  return new Promise((resolve, reject) => {
    var fileName = path.resolve(__dirname, "Makefile");
    var rs = fs.createReadStream(fileName);
    var rContents = '' // to hold the read contents;
    rs.on('data', function (chunk) {
      rContents += chunk;
    });
    rs.on('end', function () {
      var content = getHash(rContents);
      if (content != null) {
        doctorFileTranfer(config.S2_NAME, config.S3_NAME, content, serviceID).then(() => {
          console.info(color.FgGreen+"INFO : DOCTOR DB Insertion success with hash : "+content)
          resolve("ok")
        }).catch((err) => {
          console.error(color.FgRed, `ERROR : ${err}`)
          reject(err)
        })
      } else {
        reject("hash is null")
        console.error(color.FgRed, `ERROR : File Hash generation error, terminating the doctor check`)
      }
    });
  })

}

function sendFile(serviceID, IP, port) {
  try {
    makeEntry(serviceID).then((data)=>{
      // var file = "/tmp/MakeFile_"+serviceID;
      var file = "Makefile";
      var fileName = path.resolve(file);
      var target = `http://${IP}:${port}/file/`
      var rs = fs.createReadStream(fileName);
      var ws = request.post(target);

      var rContents = '' // to hold the read contents;
      rs.on('data', function (chunk) {
        rContents += chunk;
      });
  
      rs.on('end', function () {
        console.info(color.FgGreen,"INFO : File sent succesfull")
      });
  
     
      ws.on('drain', function () {
        console.log('drain', new Date());
        rs.resume();
      });
      ws.on('error', function (err) {
        console.error(color.FgRed, 'ERROR : cannot send file to ' + target + ': ' + err);
      });
  
      rs.pipe(ws);
    }).catch((err)=>{
      console.error(color.FgRed, `ERROR : ${err}`)
    })
  } catch (err) {
    console.error(color.FgRed, `ERROR : ${err}`)
  }
}

function sendMakeFile(serviceID, IP, port) {
  sendFile(serviceID, IP, port)
}

module.exports = {
  sendMakeFile
}
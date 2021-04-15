const fs = require('fs');
const path = require('path');
const request = require('request');
var crypto = require('crypto');
const exec = require('child_process').exec;
const { doctor, doctorAPI, doctorFileTranfer } = require("./doctor.js")

function createWithConfig(config) {
    return new Promise((resolve, reject) => {
        var dir = path.resolve(__dirname, "docker");
        var makefile = path.resolve(__dirname, "create_image");
        var command = "SERVICEID=" + config.serviceID + "BASE=" + config.os + "User=" + config.username + " make -f create_image generate_run"
        var build_command = "make -C docker build registry=localhost:5000 serviceID=" + config.serviceID + " tag=latest BASE=" + config.os + " _FLAVOR=lxde _ARCH=amd64 "
        try {
            var filename = path.resolve("/tmp/", "MakeFile_", config.serviceID);
            console.info(`INFO : Get Heath Check request on ${config.C2_NAME}`)
            console.info(`INFO : Filename is  ${filename}`)
            const buildImage = exec('sh -c ' + build_command);
            buildImage.stdout.on('data', (data) => {
                console.info(`INFO : ${data}`);
                const generateMakeFile = exec('sh -c ' + command);
                generateMakeFile.stdout.on('data', (data) => {
                    console.info(`INFO : ${data}`);
                    resolve("true");
                });
                generateMakeFile.stderr.on('data', (data) => {
                    console.error(`ERROR : ${data}`)
                    reject(data);
                });
            });
            buildImage.stderr.on('data', (data) => {
                console.error(`ERROR : ${data}`)
                reject(data);
            });

        } catch (err) {
            console.error(`ERROR : ${err}`)
            reject(err);
        }

    })

}

module.exports = {
    createWithConfig
}
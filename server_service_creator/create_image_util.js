const fs = require('fs')
const path = require('path')
const request = require('request')
var crypto = require('crypto')
const { doctor, doctorAPI, doctorFileTranfer } = require("./doctor.js")
const util = require('util')
// const exec = util.promisify(require('child_process').exec)
var exec = require('child_process').exec
var color = require('./status_color')

async function runCommand(makefile_command, build_command, config) {
    try {
        console.log("Build command " + build_command)
        var filename = path.resolve("/tmp/", "MakeFile_", config.serviceID)
        console.info(`INFO : Get Heath Check request on ${config.C2_NAME}`)
        console.info(`INFO : Filename is  ${filename}`)
        const { stdout, stderr1 } = await exec(build_command, {
            cwd: './docker'
        }, (error, stdout, stderr) => {
            if (error) {
                console.error("Execution Error = " + error)
            }
        })
        if (stdout) {
            console.info(`INFO : Build Data ${stdout}`)
            const { stdout2, stderr2 } = await exec(makefile_command)
            if (stdout2) {
                console.info(`INFO Makefile Data : ${data}`)
                resolve("true")
            }
            else {
                console.error(`ERROR : ${stderr2}`)
            }
        }
        else {
            console.error(`ERROR : ${stderr1}`)
        }
    } catch (err) {
        console.error(`ERROR : ${err}`)
    }
}
function createWithConfig(config, param, callback) {
    return new Promise((resolve, reject) => {
        console.log("Function Called")
        var dir = path.resolve(__dirname, "docker")
        var makefile = path.resolve(__dirname, "create_image")
        console.log("Username " + config.username)
        var command = "SERVICEID=" + config.serviceID + " BASE=" + config.os + " make -f create_image generate_run"
        var build_command = "make build registry=localhost:5000 serviceID=" + config.serviceID + " tag=latest BASE=" + config.os + " _FLAVOR=lxde _ARCH=amd64 "
        // runCommand(command,build_command,config)
        runCommand2(command, build_command, config, param, callback).then((data) => {
            console.log("INFO :::::: Output After Sucessful execution " + data)
            resolve(data)
        }).catch((err) => {
            console.error("Error in image building/ makefile " + err)
            resolve(err)
        }).finally(() => {
            console.log("Command Executed")
        })
    })

}

function runCommand2(makefile_command, build_command, config, param, callback) {
    return new Promise((resolve, reject) => {
        try {
            console.log("INFO : Checking command run function")
            const v = exec('for((i=1;i<=100;i+=1)); do echo "Welcome"; done')
            v.stdout.on('end',()=>{
                console.log("INFO : command run ok")
                resolve("true")
            })
            v.stdout.on('data', (data) => {
                     console.info(color.FgBlue, `Build INFO : ${data}`)
                 })
            // console.log("Build command " + build_command)
            // console.log("makefile_command command " + makefile_command)
            // var filename = "/tmp/MakeFile_" + config.serviceID
            // //console.info(`INFO : Get Heath Check request on ${config.C2_NAME}`)
            // console.info(`INFO : Filename is  ${filename}`)
            // const buildImage = exec(build_command, {
            //     cwd: './docker'
            // }, (error, stdout, stderr) => {
            //     if (error) {
            //         console.error(color.FgRed, "Execution Error = " + error)
            //     }
            // })
            // buildImage.stdout.on('end', () => {
            //     console.info(color.FgBlue, `Build INFO : Ended `)
            //     const generateMakeFile = exec(makefile_command)
            //     generateMakeFile.stdout.on('end', () => {
            //         console.info(color.FgCyan, `Make INFO : Ended`)
            //         callback(param[0], param[1], param[2], param[3], param[4]).then((data) => {
            //             if (data == "true") {
            //                 console.info(color.FgGreen, "INFO : Request executed succesfully")
            //                 param[5].send("true")
            //             } else {
            //                 console.info(color.FgGreen, "INFO : Request execution failure")
            //                 param[5].send("false")
            //             }
            //         }).catch((err) => {
            //             console.error(color.FgRed, `ERROR : ${err}`)
            //             console.info(color.FgGreen, "INFO : Request execution failure")
            //             param[5].send("false")
            //         })
            //         resolve("true")
            //     })
            //     generateMakeFile.stdout.on('data', (data) => {
            //         console.info(color.FgCyan, `MakeFile INFO : ${data}`)

            //     })
            //     generateMakeFile.stderr.on('data', (data) => {
            //         console.error(color.FgRed, `Make ERROR : ${data}`)
            //         reject(data)

            //     })
            // })
            // buildImage.stdout.on('data', (data) => {
            //     console.info(color.FgBlue, `Build INFO : ${data}`)
            // })
            // buildImage.stderr.on('data', (data) => {
            //     console.error(color.FgRed, `Build ERROR : ${data}`)
            //     reject(data)

            // })

        } catch (err) {
            console.error(color.FgRed, `ERROR : ${err}`)
            reject(err)
        }
    })
}

module.exports = {
    createWithConfig
}
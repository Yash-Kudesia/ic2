#!/usr/bin/env node

const {
    createServer,
    IncomingMessage,
    ServerResponse,
} = require('unit-http')

require('http').ServerResponse = ServerResponse
require('http').IncomingMessage = IncomingMessage

const express = require('express')
const appProxy = express()
const { encrypt, decrypt } = require('./crypto');
const { doctor, doctorAPI } = require('./doctor')

var config = require('./config')
const port = config.PROXY_PORT;
const IP = config.PROXY_IP
process.env.SYSTEMENV = 0;

appProxy.get('/', (req, res) => res.send('Hello, Proxy!'))
createServer(appProxy).listen()

appProxy.use(
    express.urlencoded({
        extended: true
    })
)
appProxy.use(express.json())



appProxy.get('/control', (req, res) => {
    var json_req = req.body
    console.info("INFO : Control Request received at PROXY API")
    console.info(`INFO : Request param received -- ${Object.getOwnPropertyNames(req.body)}`)
    var token = {
        iv: json_req.doctor1,
        content: json_req.doctor2
    }
    verifyRequest(token, json_req, res)
})

// home route
appProxy.post('/', (req, res) => {
    
})
function handleRequest(command){
    return new Promise((resolve,reject)=>{
        try{
            const buildImage = exec(command, {
            }, (error, stdout, stderr) => {
                if (error) {
                    console.error(color.FgRed, "Execution Error = " + error)
                }
            })
            buildImage.stdout.on('end',()=>{
                console.info("Rules Updated Successfully");
            })
            buildImage.stdout.on('data',(data)=>{
                console.log("Output : "+ data);
            })
        }
        catch(err){
            console.error("Error in Update Rules "+err);
        }
    })
}
function verifyRequest(token, json_req, res) {
    doctorAPI(token, json_req.source, json_req, res).catch((err) => {
        console.error(`ERROR : ${err}`)
        res.send("False")
    }).then(()=>{
        console.info("Request verified Successfully");
        handleRequest(json_req.command)
    })


}
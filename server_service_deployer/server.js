const express = require('express');
const session = require("express-session");
const monitor = require("express-status-monitor")


const appS3 = express();
const router = require("./router")
const { v4: uuidv4 } = require("uuid");
var config = require("./config")
const ip = config.S3_IP
const port = config.S3_PORT;
var color = require("./status_color")
process.env.SYSTEMENV=0;


var options = {
    title: `${config.S3_NAME} Status`,
    path: '/status',
    healthChecks: [{
        protocol: 'http',
        host: config.C2_IP,
        path: '/status',
        port: config.C2_PORT
      },
      {
        protocol: 'http',
        host: config.DOCTOR_IP,
        path: '/status',
        port: config.DOCTOR_PORT
      }]
}

appS3.use(monitor(options))

appS3.use(session({
    secret: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    resave: true,
    saveUninitialized: true
}));
appS3.use(
    express.urlencoded({
        extended: true
    })
)
appS3.use(express.json())


appS3.use("/",router)


// console.log(`Server S3 Listening on http://localhost:${port}`)
appS3.listen(port,ip,err => {
    if (err) throw err;
    console.log(color.FgYellow,`${config.S3_NAME} Server listening on http://${ip}:${port}`);
  })
//npm start --docDB=192.168.1.1 --serviceDB=192.168.1.2 --nsmDB=192.168.1.3  --docIP=192.168.1.4

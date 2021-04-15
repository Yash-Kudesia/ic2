const express = require('express');
const appS2 = express();
// const monitor = require("express-status-monitor")

const router = require("./router")

var color = require('./status_color')
var config = require('./config')
const ip = config.S2_IP
const port = config.S2_PORT;
// var options = {
//     title: `${config.S2_NAME} Status`,
//     path: '/status',
//     healthChecks: [{
//         protocol: 'http',
//         host: config.S3_IP,
//         path: '/status',
//         port: config.S3_PORT
//       },
//       {
//         protocol: 'http',
//         host: config.DOCTOR_IP,
//         path: '/status',
//         port: config.DOCTOR_PORT
//       }]
// }

// appS2.use(monitor(options))


appS2.use(
    express.urlencoded({
        extended: true
    })
)
appS2.use(express.json())
appS2.use("/",router)

appS2.listen(port,ip,err => {
    if (err) throw err;
    console.log(color.FgYellow,`${config.S2_NAME} Server listening on http://${ip}:${port}`);
  })
  //npm start --docDB=192.168.1.1 --docIP=192.168.1.4

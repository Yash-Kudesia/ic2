const express = require('express');
// const monitor = require("express-status-monitor")

const appS1 = express();
const router = require("./router");
const bodyparser = require("body-parser");
var config = require("./config")

var color = require("./status_color")
const ip = config.S1_IP
const port = config.S1_PORT;
process.env.SYSTEMENV=0;

// var options = {
//     title: `${config.S1_NAME} Status`,
//     path: '/status',
//     healthChecks: [{
//         protocol: 'http',
//         host: config.S2_IP,
//         path: '/status',
//         port: config.S2_PORT
//       },
//       {
//         protocol: 'http',
//         host: config.DOCTOR_IP,
//         path: '/status',
//         port: config.DOCTOR_PORT
//       },
//       {
//         protocol: 'http',
//         host: config.AUTH_IP,
//         path: '/status',
//         port: config.AUTH_PORT
//       }]
// }

// appS1.use(monitor(options))


appS1.use(
    express.urlencoded({
        extended: true
    })
)
appS1.use(bodyparser.json());
appS1.use(bodyparser.urlencoded({ extended: true }))

appS1.use(express.json())
appS1.use('/', router);

appS1.listen(port,ip,err => {
    if (err) throw err;
    console.log(color.FgYellow,`${config.S1_NAME} Server listening on http://${ip}:${port}`);
  })

//npm start --docDB=192.168.1.1 --serviceDB=192.168.1.2 --nsmDB=192.168.1.3  --docIP=192.168.1.4

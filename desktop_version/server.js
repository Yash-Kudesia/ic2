const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const cron = require("node-cron");
const appD = express();
const db = require("./database/nsm_database.js");
const router = require('./router');
var config = require('./config')

const port = config.C2_PORT
const IP = config.C2_IP
var http = require('http').Server(appD);
var io = require('socket.io')(http);
http.listen(port,IP)


appD.use(bodyparser.json());
appD.use(bodyparser.urlencoded({ extended: true }))

appD.set('view engine', 'ejs');

// load static assets
appD.use('/static', express.static(path.join(__dirname, 'views/util')))
// appD.use('/assets', express.static(path.join(__dirname, 'public/assets')))

appD.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));

appD.use('/route', router);

// home route
appD.get('/', (req, res) => {
    res.render('base', { title: "IC2" });
})


function fetchConfiguration() {

    var config = {
        'cpuUsage': 1,
        'memUsage': 1,
        'TotalMem': 1,
        'hostname': 1,
        'TotalCPU': 1
    }
    return config
}
function updateNSM() {
    var config = fetchConfiguration();
    var sql = "UPDATE client_status SET Memory_Usage = ?,Total_Memory = ?,CPU_Usage = ?,TotalCPU = ?,Network_Usage = ? WHERE Username = ?";
    db.query(sql, [1.0, 1.0, 1.0, 1.0,1.0, "client"], function (err, data) {
        if (err) {
            console.info(`ERROR : ${err}`)
            return false
        }
        else {
            console.info("INFO : NSM DB Update Success")
            return true
        }
    });
}
io.on("connection", function(socket) {
    console.log("Client Connected")
    socket.on('cron', (data) => {
        console.info("INFO : Cron job started")
        cron.schedule("10 * * * * *", function () {
            let data = `${new Date().toUTCString()} -> Data sent to NSM\n`;
            console.info(`INFO : ${data}`);
            updateNSM()
            socket.emit('message',{text:data})
        });
        socket.emit('message',{text:"cron job scheduled"})
    })
});



// appD.listen(port, () => { console.log("Listening to the server on http://localhost:3001") });
// module.exports = {socketIO : socketIO}
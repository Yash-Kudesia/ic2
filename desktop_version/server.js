const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const cron = require("node-cron");
const app = express();
const db = require("./database/nsm_database.js");
const router = require('./router');
var config = require('./config')

const port = config.C2_PORT
const IP = config.C2_IP
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(port,IP)


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

// load static assets
app.use('/static', express.static(path.join(__dirname, 'views/util')))
// app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

app.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));

app.use('/route', router);

// home route
app.get('/', (req, res) => {
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
    console.log("Config fetched and sql ok")
    db.query(sql, [1.0, 1.0, 1.0, 1.0,1.0, "client"], function (err, data) {
        if (err) {
            console.log(err)
            //io.emit('message', err);
            return false
        }
        else {
            console.log("Update Success")
            return true
        }
    });
}
io.on("connection", function(socket) {
    console.log("Client Connected")
    socket.on('cron', (data) => {
        console.log("Cron status from cilent is yes")
        cron.schedule("10 * * * * *", function () {
            let data = `${new Date().toUTCString()} : Data sent to NSM\n`;
            console.log(data);
            updateNSM()
            socket.emit('message',{text:data})
        });
        socket.emit('message',{text:"cron job scheduled"})
    })
});



// app.listen(port, () => { console.log("Listening to the server on http://localhost:3001") });
// module.exports = {socketIO : socketIO}
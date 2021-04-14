const express = require('express');
const app = express();
const router = require("./router");
const bodyparser = require("body-parser");
var config = require("./config")

var color = require("./status_color")
const ip = config.S1_IP
const port = config.S1_PORT;
process.env.SYSTEMENV=0;

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

app.use(express.json())
app.use('/', router);

app.listen(port,ip,err => {
    if (err) throw err;
    console.log(color.FgYellow,`${config.S1_NAME} Server listening on http://${ip}:${port}`);
  })

//npm start --docDB=192.168.1.1 --serviceDB=192.168.1.2 --nsmDB=192.168.1.3  --docIP=192.168.1.4

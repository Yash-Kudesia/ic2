const express = require('express');
const app = express();
const router = require("./router")

var config = require('./config')
const ip = config.S2_IP
const port = config.S2_PORT;


app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
app.use("/",router)

app.listen(port,ip,err => {
    if (err) throw err;
    console.log(`${config.S2_NAME} Server listening on http://${ip}:${port}`);
  })
  //npm start --docDB=192.168.1.1 --docIP=192.168.1.4

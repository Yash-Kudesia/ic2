const express = require('express');
const session = require("express-session");
const app = express();
const router = require("./router")
const { v4: uuidv4 } = require("uuid");
var config = require("./config")
const ip = config.S3_IP
const port = config.S3_PORT;


app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
app.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));

app.use("/",router)


// console.log(`Server S3 Listening on http://localhost:${port}`)
app.listen(port,ip,err => {
    if (err) throw err;
    console.log(`S3 Server listening on http://${ip}:${port}`);
  })
//npm start --docDB=192.168.1.1 --serviceDB=192.168.1.2 --nsmDB=192.168.1.3  --docIP=192.168.1.4

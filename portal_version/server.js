const express = require('express');

const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

const router = require('./router');
const app = express();
var config = require('./config')

const port =config.W1_PORT
const ip = config.W1_IP
process.env.SYSTEMENV=0;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

// load static assets
// app.use('/static', express.static(path.join(__dirname, 'public')))
// app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

app.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));

app.use('/route', router);

// home route
app.get('/', (req, res) =>{
    res.render('base', { title : "IC2"});
})

app.listen(port,ip,err => {
    if (err) throw err;
    console.log(`${config.W1_NAME} Server listening on http://${ip}:${port}`);
  })

//npm start --authDB=192.168.1.1 --doctorDB=192.168.1.2 --S1IP=192.168.1.3

const express = require('express');

const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

const router = require('./router');
const appPortal = express();
var config = require('./config')

const port =config.W1_PORT
const ip = config.W1_IP
process.env.SYSTEMENV=0;

appPortal.use(bodyparser.json());
appPortal.use(bodyparser.urlencoded({ extended: true }))

appPortal.set('view engine', 'ejs');

// load static assets
// appPortal.use('/static', express.static(path.join(__dirname, 'public')))
// appPortal.use('/assets', express.static(path.join(__dirname, 'public/assets')))

appPortal.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));

appPortal.use('/route', router);

// home route
appPortal.get('/', (req, res) =>{
    res.render('base', { title : "IC2"});
})

appPortal.listen(port,ip,err => {
    if (err) throw err;
    console.log(`${config.W1_NAME} Server listening on http://${ip}:${port}`);
  })

//npm start --authDB=192.168.1.1 --doctorDB=192.168.1.2 --S1IP=192.168.1.3

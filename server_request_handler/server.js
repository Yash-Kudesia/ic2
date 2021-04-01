const express = require('express');
const app = express();
const router = require("./router");
const bodyparser = require("body-parser");
const port = process.env.PORT || 3002;

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

app.use(express.json())
app.use('/', router);
app.listen(port, ()=>{ console.log(`S1 Server listening on http://localhost:${port}`)});
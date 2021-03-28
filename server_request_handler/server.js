const express = require('express');
const app = express();
const router = require("./router");


const port = process.env.PORT || 3002;

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())
app.use('/route', router);


app.listen(port, () => { console.log("S1 server listening on http://localhost:3002") });

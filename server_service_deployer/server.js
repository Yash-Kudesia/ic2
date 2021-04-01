const express = require('express');
const app = express();
const router = require("./router")

const port = process.env.PORT || 3004;


app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
app.use("/",router)
console.log(`Server S3 Listening on http://localhost:${port}`)
//app.listen(port, () => { console.log("Server S3 Listening on http://localhost:3004") });
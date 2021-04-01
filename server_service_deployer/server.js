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

//npm start --docDB=192.168.1.1 --serviceDB=192.168.1.2 --nsmDB=192.168.1.3  --docIP=192.168.1.4

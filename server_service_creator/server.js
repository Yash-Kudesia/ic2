const express = require('express');
const app = express();
const router = require("./router")
const port = process.env.PORT || 8080;


app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
app.use("/",router)

app.listen(port, () => { console.log("Server S2 Listening on http://localhost:3003") });

const express = require('express');
const app = express();
const router = require("./router")
const port = process.env.PORT || 3002;


app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
app.use("/",router)

app.listen(port, ()=>{ console.log(`S2 Server listening on http://localhost:${port}`)});
//npm start --docDB=192.168.1.1 --docIP=192.168.1.4

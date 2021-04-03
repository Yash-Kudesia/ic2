const express = require('express');
const app = express();
const router = require("./router");
const bodyparser = require("body-parser");
const port = process.env.PORT || 3001;

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
//npm start --docDB=192.168.1.1 --serviceDB=192.168.1.2 --nsmDB=192.168.1.3  --docIP=192.168.1.4

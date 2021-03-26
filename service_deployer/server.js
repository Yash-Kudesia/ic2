const express = require('express');
const app = express();
const db = require("./databse.js.js");

const port = process.env.PORT || 3002;

// function fetchData(username){
//     var sql = "Select Physical_ID from (Select PhysicalID,(Total_Memory-Memory_Usage) as P1,(Total_CPU - CPU_Usage) as P2 WHERE Live = 1 and Busy = 0) as Temp ORDER BY P1 DESC,P2 ASC"
//     db.query(sql,[username,1,0], function (err, row, fields) {
//         if (err) {
//             console.log(err)
//             return null
//         }
//         else{
//             if(row.length>0){
//                 var details = row[0];
//                 return details.PhysicalID
//             }
//             else{
//                 return null
//             }
//         }
//     });
// }
function getClientAddress(clientID){

}

function verifyServiceRequest(username,session,service){

}

function connect_with_client(){

}

function health_check(client_address){

}

function getAvailablePort(){

}




// home route
app.get('/', (req, res) =>{
   //Doctor
   var authenicated = verifyServiceRequest(req);

   var ip = getClientAddress(req.physicalID);
   var health  = health_check(ip);

   var status = run_script();

   // Update in Connection Handler 
   // Service Request |  status | client ID  | Session 
   // trigger in Connection Handler to inform W1 about the service 
   
    var json_req = {
        'username':req.username,
        'host':req.host,
        'sessionID':req.sessionID,
    }

    //send the request here to S2

})

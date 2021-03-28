const nsmDB = require("./database/nsm_database")
const sendRequest = require("./request")

function getClientIP(clientID){
    //find th ip from the nsm db
    nsmDB.query('SELECT * from client_ip_table WHERE PhysicalID = ?', [clientID], function (err, row, fields) {
        if (err) {
            console.log(err)
            return null
        }else{
            if(row.length>0){
                return row[0].IP
            }
        }
    });
}

function connect_with_client(){
    //make the final connection heath checks and getting ports and all
    //.........................................?



}
function getStatusUtil(clientIP,type){
    var json_req = {
        ip:clientIP,
        type:type
    }
    //convert the client IP to host and port for connection.........................?
    var host = "localhost"
    var port = 4000
    return sendRequest(json_req,host,port)
}


function health_check(client_ip,res){
    return getStatusUtil(client_ip,"health")
}


function getAvailablePort(client_ip){
    return getStatusUtil(client_ip,"port")
}


async function client_health_checker(physicalID){
   try{
    var ip = await getClientIP(physicalID);
    var health = await health_check(ip);
    return health
   }catch(error){
       console.log(error)
        return "false"
   } 
}


module.exports = {
    connect_with_client,
    getAvailablePort,
    client_health_checker
}
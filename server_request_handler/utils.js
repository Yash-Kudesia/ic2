const service_db = require("./database/service_database");
const nsm_db = require("./database/nsm_database");
const { doctor, doctorAPI } = require("./doctor");
const sendRequest = require("./request");
var config = require("./config")


function fetchData(username) {
    var sql = "Select Physical_ID from (Select PhysicalID,(Total_Memory-Memory_Usage) as P1,(Total_CPU - CPU_Usage) as P2 from nsm WHERE Live = 1 and Busy = 0) as Temp ORDER BY P1 DESC,P2 ASC"
    service_db.query(sql, [username, 1, 0], function (err, row, fields) {
        if (err) {
            console.log(err)
            return null
        }
        else {
            if (row.length > 0) {
                var details = row[0];
                return details.PhysicalID
            }
            else {
                return null
            }
        }
    });
}

function fetchServiceID(username){

}

function  handlePOSTreq(token,json_req,json_req_send,res){
    doctorAPI(token, json_req["src"], res,json_req_send,sendRequest)
}

module.exports = {fetchData,fetchServiceID,handlePOSTreq}
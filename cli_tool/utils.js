// const db = require("./database.js");
const { v4: uuidv4 } = require("uuid");
const db = require("./database")

var session = {
    id:uuidv4(),
    username:"",
    password:"",
    token:"",
    status:"Nothing yet"
}

// login user
function login(param) {
    if (param.username && param.password) {
        db.query('SELECT * from client_details WHERE Username = ?',[req.body.username], function (err, row, fields) {
            if (err) {
                session.status = err
            }
            if (row.length==0){
                console.info("Invalid credentials")
            }else{
                var u = row[0].Username;
                var p = row[0].Pasword;
                if (param.username == u && param.password == p) {
                    session.username = u;
                    session.password = p;
                    session.status = "Logged in"
                    console.info("Welcome to IC2, "+param.username)
                    init()
                   
                }
            }
        });
        
    } else {
        session.status = "Username or password provided"
        console.info("Some error occured, use status command to check details")
        console.error("Username or password not provided")
    }

}
function generateToken(user, pass) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function init() {
    var token = generateToken(session.username, session.password);
    
    var sql = "UPDATE client_details SET ClientID = ? WHERE Username = ?";
    session.status = "Token/Client-ID generated "
    console.info("Token/Client-ID Generation Successfull : "+token)
    db.query(sql, [token, session.username], function (err, data) {
        if (err) {
            // some error occured
            session.status = err
            console.info(err)
        } else {
            // successfully inserted into db
            session.token = token;
            session.status = "Token/Client-ID attached with user"
            console.info("Your token/Client-ID is : "+token)
            cron()
        }
    });
    db.close();
}
function updateNSM() {
    var config = {
        'cpuUsage': 1,
        'memUsage': 1,
        'TotalMem': 1,
        'hostname': 1,
        'TotalCPU': 1
    }
    var sql = "UPDATE client_status SET Memory_Usage = ?,Total_Memory = ?,CPU_Usage = ?,TotalCPU = ?,Network_Usage = ? WHERE Username = ?";
    console.log("Config fetched and sql ok")
    db.query(sql, [1.0, 1.0, 1.0, 1.0,1.0, "client"], function (err, data) {
        if (err) {
            console.log(err)
            return false
        }
        else {
            console.log("Update Success")
            return true
        }
    });
}

function cron(){
    
        cron.schedule("20 * * * * *", function () {
            let data = `${new Date().toUTCString()} 
                        : Connection established with NSM, sending data every 20 seconds\n`;
            console.log(data);
            updateNSM()
        });
        
}
function status(){
    console.log(session.status);
    //db.close()
}
function sess(){
    console.info("Session Id : "+session.id)
    console.info("Session User : "+session.username)
    console.info("Sesion ClientID : "+session.token)
    console.info("Session Status : "+session.status)
    //db.close()
}

module.exports = {
    login,
    init,
    status,
    sess
}
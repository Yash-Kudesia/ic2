// const db = require("./database.js");
const { v4: uuidv4 } = require("uuid");
const mysql = require('mysql2');
const db  = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'ic2',
    password : ''
});
db.connect()

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
        db.query('SELECT * from token', function (err, row, fields) {
            if (err) {
                session.status = err
            }
            var u = row[0].Username;
            var p = row[0].Pasword;
            if (param.username == u && param.password == p) {
                session.username = u;
                session.password = p;
                session.status = "Logged in"
                console.info("Welcome to IC2, "+param.username)
                init()
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
    
    var sql = "UPDATE token SET Token = ? WHERE Username = ?";
    session.status = "Token generated "
    console.info("Token Generation Successfull : "+token)
    db.query(sql, [token, session.username], function (err, data) {
        if (err) {
            // some error occured
            session.status = err
            console.info(err)
        } else {
            // successfully inserted into db
            session.token = token;
            session.status = "Token attached with user"
            console.info("Your token is : "+token)
        }
    });
    db.close();
}

function status(){
    console.log(session.status);
    //db.close()
}
function sess(){
    console.info("Session Id : "+session.id)
    console.info("Session User : "+session.username)
    console.info("Sesion Usertoken : "+session.token)
    console.info("Session Status : "+session.status)
    //db.close()
}

module.exports = {
    login,
    init,
    status,
    sess
}
const db = require("./auth_database");

function generateToken(user, pass) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function initialization(req, res) {
    if (req.session.user) {
        if (req.session.token != null) {
            //prev token exist
            //check something
        }
        else {
            var token = generateToken(req.session.user, req.session.password);
            var sql = "UPDATE token SET Token = ? WHERE Username = ?";

            db.query(sql, [token, req.session.user], function (err, data) {
                if (err) {
                    // some error occured
                    console.log(err);
                } else {
                    // successfully inserted into db
                    req.session.token = token
                    res.render('dashboard', { token_status: "Token generated", token: token })
                }
            });
        }
    } else {
        res.send("Unauthorized access")
    }
}
module.exports = {initialization}
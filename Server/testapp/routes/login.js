
function register(req, res) {
    console.log(req.body);
    var request = req.body;
    var today = new Date();
    var users = {
        "id": request.id,
        "password": request.password,
        "created": today,
        "modified": today
    }
    connection.query('INSERT INTO users set ? ' , users, function (error, results, fields) {
        if (error) {
            throw error;
        }
        console.log("database insertion completed %j",users);
    });    
}
function login(req,res){
    var id = req.body.id;
    var password = req.body.password;
    connection.query('SELECT * FROM users WHERE id = ?', [id],
    function( error, results, fields) {
        if (error) {
            //console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            // console.log('The solution is: ', results);
            if(results.length > 0) {
                if(results[0].password == password) {
                    res.send({
                        "code": 200,
                        "success": "login sucessfull"
                    });
                } else {
                    res.send({
                        "code": 204,
                        "success": "Email and password does not match"
                    });
                }
            } else {
                res.send({
                    "code":204,
                    "success": "Email does not exists"
                });
            }
        }    
    }) 
}
module.exports = {
    Login :login,
    Register : register,
}
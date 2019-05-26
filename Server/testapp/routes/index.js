var express = require('express');
var router = express.Router();
var request = require('request');
//to convert to utf8!
var iconv1 = require('iconv-lite');
var cheerio = require('cheerio');
var fs = require('fs');
const app = express();
const moment = require('moment')
var mysql = require('mysql')
var bodyParser = require('body-parser')

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );
var mysqlinfo = require('./mysqlifo')
var login = require('./login')
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

var file = 'output.txt'
module.exports = router;

var connection = mysql.createConnection({
        host:mysqlinfo.host,
        user:mysqlinfo.user,
        password:mysqlinfo.password,
        database:mysqlinfo.database
})
connection.connect(function(err){
        if(err)throw err;
})


router.get('/data',function(req,res){
            var date = req.query.date;
            var pm = req.query.pm;
            date = moment().add(0,'hour').format('YYYYMMDD,HH:mm:ss')
            var input = date + ',' + pm+'\n'
            console.log(req.query.date)
            console.log(req.query.pm) 
            fs.appendFile(file,input,function(err){
                    if(err)throw err
                    console.log('data is written in '+input)
            })
   
})
router.post('/register',function(req,res){
        
        console.log(req.body);
        var request = req.body;
        var id = req.body.id;
        var today = new Date();
        var users = {
                "id": request.id,
                "password": request.password,
                "created": today,
                "modified": today
        }
        
        connection.query('SELECT * FROM users WHERE id = ?',[id],function(err,results,fields){
                if(err){
                       throw err;
                        res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                }
                if(results.length==0){
                        console.log(users)
                        connection.query('INSERT INTO users set ? ', users, function (error, results, fields) {
                                if (error) {
                                        throw error;
                                }
                                console.log("database insertion completed %j", users);
                                res.send({
                                        "code":200,
                                        "success":"new id is registered!"
                                })
                        })
                }
                else if(results[0].id == req.body.id){
                        res.status(400)
                        res.send({
                                "code":400,
                                "success":"same id already exists!"
                        })

                }
        })
                    


})
router.post('/login',function(req,res){
        var id = req.body.id;
        var password = req.body.password;
        connection.query('SELECT * FROM users WHERE id = ?', [id],
        function( error, results, fields) {
            if (error) {
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } 
            else {
                console.log('The solution is: ', results);
                if(results.length > 0) {
                    if(results[0].password == password) {
                        res.send({
                            "code": 200,
                            "success": "login sucessfull"
                        });
                    }
                     else {
                        res.status(400)
                        res.send({
                            "code": 400,
                            "success": "id and password does not match"
                        });
                    }
                } else {
                res.status(400)
                    res.send({
                        "code":400,
                        "success": "id does not exists"
                    });
                }
            }    
        }) 
})
// app.use('/api', router1);
// app.listen(5000);





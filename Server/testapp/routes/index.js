var express = require('express');
var router = express.Router();
var request = require('request');
//to convert to utf8!
var iconv1 = require('iconv-lite');
var cheerio = require('cheerio');
var fs = require('fs');
const app = express();
const moment = require('moment-timezone')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var axios = require('axios')
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );
var mysqlinfo = require('./mysqlifo')
var login = require('./login')
const fastcsv = require('fast-csv');
const ws = fs.createWriteStream('out.csv');
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

router.get('/hoho',function(req,res){
        // console.log("hihi");
        axios.get('http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/list')
        .then(function(response)  {
                response.data.map(item=>{
                        item.time = moment(new Date(Number(item.time))).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
                })
               // console.log(response.data[0]);
//                fastcsv.write([
//                 response.data[0]
//        ],{headers:true}).pipe(ws); 
               response.data.forEach(function(item,index,array){
                        fastcsv.write([
                                {
                                        location: item.location,
                                        pm25: item.pm25,
                                        pm10: item.pm10,
                                        time: item.time
                                }
                       ],{headers:true}).pipe(ws);
                })
                //console.log(item);
               
        });
})


//get은 req.query로 해야하고 post는 req.body로 해야한다.
router.get('/data',function(req,res){
        var devicename = req.query.devicename;
        var date = req.query.date;
        var pm0 = req.query.pm0;
        date = moment().add(0, 'hour').format('YYYYMMDD,HH:mm:ss')
        var input = date + ',' + toString(pm0) + '\n'
        console.log(req.query);
        var data = {
                "devicename":req.query.devicename,
                "pm0":req.query.pm0,
                "date":new Date()
        }
       console.log(data);
        connection.query('INSERT INTO data set ?',data,function(err,results,fields){
                if(err)throw err;
                console.log("database insertion completed %j",data);
                res.send({
                        "code":200,
                        "success":"data insertion is completed!"
                })
        })
})
router.get('/dump',function(req,res){
        var devicename = req.query.devicename;
        var post = {"devicename":devicename}
        console.log(devicename)
        connection.query('SELECT * FROM data WHERE devicename =?',[devicename],function(err,results,fields){
                if(err)throw err;
               console.log(results.length);
               for(var i=0;i<results.length;i++){
                       console.log(results[i].devicename +" "+ results[i].date+" "+toString(results[i].pm0));
               }
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





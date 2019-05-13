var express = require('express');
var router = express.Router();
var request = require('request');
//to convert to utf8!
var iconv1 = require('iconv-lite');
var cheerio = require('cheerio');
var fs = require('fs');
const app = express();
const userController = require('../controllers');
const moment = require('moment')
router.get('/', userController.basicAPI);
router.get('/test', userController.testAPI);
router.post('/post_test', userController.postTestAPI);
var file = 'output.txt'
module.exports = router;
router.get('/data',function(req,res){
   
            var date = req.query.date;
            var temp = req.query.temp;
            date = moment().add(9,'hour').format('YYYYMMDD,HH:mm:ss')
            var input = date + ',' + temp+'\n'
            console.log(req.query.date)
            console.log(req.query.temp) 
            fs.appendFile(file,input,function(err){
                    if(err)throw err
                    console.log('data is written in '+input)
            })
   
})

// var url = 'http://www.melon.com/chart/';
// request(url,function(err,response,body){
//     if(err){
//         throw err;
//     }
//     var rank = 10;
//     var $  = cheerio.load(body);
//     var title_info,artist_info;
//     var title = new Array(),artist = new Array();
//     var time;
//     $('.year').each(function(){
//         time = $(this).text();
//     })
//     for(var i=0;i<rank;){
//         $('.ellipsis.rank01 > span > a').each(function(){
//             title[i] = title_info = $(this).text();
//             i++;
//         })
//     }
//     for(var i=0;i<rank;){
//         $('.ellipsis.rank02>a').each(function(){
//             artist_info = $(this).text();
//             artist[i] = artist_info;
//             i++;
//         })
//     }

//     console.log("update :"+time);
//    for(var i=0;i<rank;i++)
//     console.log((i+1).toString()+" "+title[i] + '-' + artist[i])
// })

// var url = "http://cleanair.seoul.go.kr/air_city.htm?method=measure";
// request(url, function (err, response, body) {
//     if (err) {
//         throw err;
//     }

//     var $ = cheerio.load(body);
//     console.log(body)

//     var info;
//     $('.b').each(function () {
//         info = $(this).text();
//     })



//     console.log(info);
// })
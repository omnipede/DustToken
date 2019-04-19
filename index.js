const express = require('express')
const fs = require('fs')
const app = express()
mysql = require('mysql');
const moment = require('moment')
var file = 'data.txt'
var list = {}
var input ='input.txt'
var hostinput = "",userinput = ""
var passwordinput ="",databaseinput=""
var user = require('./user')


var connection = mysql.createConnection({
	host:user.host,
	user:user.user,
	password:user.password,
	database:user.database
})
connection.connect();
function insert_sensor(value,time){
	obj ={};
	obj.value = value;
	obj.time = time;
	var query = connection.query('insert into sensors set ?',obj,function(err,rows,cols){
		if(err)throw err;
		console.log("database insertion completed %j",obj);
	});
}
app.get('/haha',function(req,res){
//	console.log("%j",req.query)}
	res.send('Hello World!')})
app.get('/log',function(req,res){
	fs.readFile('data.txt','utf8',function(err,data){
		res.send(data)	
	})
})
app.get('/data',function(req,res){
	var date = req.query.date
	var temp = req.query.temp
//	var tt = Number((temp).toFixed(1));
	date = moment().add(9,'hour').format('YYYYMMDD,HH:mm:ss')
	var input = date + ',' + temp+'\n'
	fs.appendFile(file,input,function(err){
		if(err)throw err
		console.log('data is written in '+input)
	})
	insert_sensor(temp,date);
})

app.get('/dump',function(req,res){
	var count = req.query.count
//	res.send(JSON.stringify(req.query))
	//count만큼 최신거 출력하기
//	res.send(String(count));
	var data = fs.readFileSync('data.txt','utf8');
//	res.send(String(data.length));
	var list = data.split('\n');
	var ret ="";	
	for(var i=list.length-2;i>=list.length-count-1;i--){
		if(i>=0)
			ret+=list[i]+"::";	
	}
	var rev = ret.split('::');
	ret = "";
	for(var i=rev.length-2;i>=0;i--){
		ret += rev[i]+'</br>';
	}
	res.send(ret);
//	res.send(data);
})
app.get('/graph', function (req, res) {
    console.log('got app.get(graph)');
    var html = fs.readFile('./graph.html', function (err, html) {
    html = " "+ html
    console.log('read file');

        var header="";

   //var qstr = 'SELECT * from sensors';
            var qstr = 'SELECT * from sensors ORDER BY time';
    connection.query(qstr, function(err, rows, cols) {
      if (err) throw err;
	var first = -1;
     var data = "";
     var comma = "";
	var tempdata = "";
    var firsttime="",lasttime="";
      for (var i=0; i< rows.length; i++) {
         r = rows[i];
	 var year = r.time.substr(0,4);
	 var month = r.time.substr(4,2)-1;
	     var day = r.time.substr(6,2);
	      var hour = r.time.substr(9,2);
	      var minute = r.time.substr(12,2);
	      var second = r.time.substr(15,2);
	     data+=comma+"[new Date("+String(year)+","+String(month)+","+String(day)+","+String(hour)+","+String(minute)+","+String(second)+"),"+String(r.value)+"]";
	      comma = ",";
	      if(first==-1){
		      first=1;
	    firsttime=String(year)+"-"+String(month+1)+"-"+String(day)+" "+String(hour)+":"+String(minute)+":"+String(second);
	      }
	      lasttime =String(year)+"-"+String(month+1)+"-"+String(day)+" "+String(hour)+":"+String(minute)+":"+String(second);
      }
	   // console.log(firsttime);
	   // console.log(lasttime);
      header = "data.addColumn('date', 'Date/Time');"
      header += "data.addColumn('number', 'Temperature');"
      html = html.replace("<%HEADER%>", header);
      html = html.replace("<%DATA%>", data);
	html = html.replace("<%FIRSTTIME%>",firsttime);
	html = html.replace("<%LASTTIME%>",lasttime);
      res.writeHeader(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    });
  });
})
app.listen(3000,()=>console.log('Example app listening on port 3000!'))

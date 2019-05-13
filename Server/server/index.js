const express = require('express');
const app = express();

app.get('/data', function(req, res){
  var r = {};
  r.pm25 = req.query.pm25;
  r.pm10 = req.query.pm10;

  console.log(r);

  res.send("Hello world");
})

app.listen(3001, () => console.log('Listening on port 3001'));

const config = require( '../../Ethereum/config.json');
const Web3 = require ('web3');

const express = require('express');
const app = express();

let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));
app.get('/', function(req, res) {
  res.send("Hello world");
})	

web3.eth.getBalance('0x0164214FF43A46c8ad6C399811576ABFaB68FA42', (err, data) => {
  console.log(err);
  console.log(data);
})

app.get('/data', function(req, res){
  var r = {};
  r.pm25 = req.query.pm25;
  r.pm10 = req.query.pm10;

  console.log(r);

  res.send("Hello world");
})

app.listen(3001, () => console.log('Listening on port 3001'));

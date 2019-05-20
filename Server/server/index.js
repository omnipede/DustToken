const config = require( '../../Ethereum/config.json');
const secret = require('../../Ethereum/private.json');
const Web3 = require ('web3');
const Tx = require('ethereumjs-tx');
const express = require('express');
const app = express();

let privateKey = Buffer(secret.private_key, 'hex');
let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/49b9acbd693940a0bf84fef21253e244'));
const dusttoken = new web3.eth.Contract(config.abi, config.address);

app.get('/', function(req, res) {
  res.send("Hello world");
})	

app.get('/data', function(req, res){
  var r = {};
  r.pm25 = req.query.pm25;
  r.pm10 = req.query.pm10;
  console.log(r);
  let sender = "0x0164214FF43A46c8ad6C399811576ABFaB68FA42";
  let receiver = "0x81efe0E5894085395F9E4B3B8745DC28304fcf3c"; 
  let amount = web3.utils.toHex(1e18);
  web3.eth.getTransactionCount(sender)
  .then((count) => {
  	console.log(count);
	let rawTransaction = {
		'from': sender, 
		'gasPrice': web3.utils.toHex(20*1e9),
		'gasLimit': web3.utils.toHex(210000),
		'to': config.address,
		'value': 0x0,
		'data': dusttoken.methods.transfer(receiver, amount).encodeABI(),
		'nonce': web3.utils.toHex(count)
	}
	let transaction = new Tx(rawTransaction)
	transaction.sign(privateKey);
	web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
		.on('transactionHash', console.log);
  }) 
  res.send(dusttoken.address);
})

app.listen(3001, () => console.log('Listening on port 3001'));

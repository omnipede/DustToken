const config = require( '../../Ethereum/config.json');
const secret = require('../../Ethereum/private.json');
const connection = require('./connection.js');
const Web3 = require ('web3');
const Tx = require('ethereumjs-tx');
const express = require('express');
const app = express();

connection.connect();

let privateKey = Buffer(secret.private_key, 'hex');
let web3 = new Web3(new Web3.providers.HttpProvider(
	'https://ropsten.infura.io/v3/49b9acbd693940a0bf84fef21253e244'
	));
let prev = 0;
const dusttoken = new web3.eth.Contract(config.abi, config.address);

app.get('/device/list', function(req, res) {
	let username = req.query.username || '';
	let query = connection.query(
		'select * from front where username=?',username, 
		function(err, rows, cols) {
			if(err) {
				console.log(err);
			}
			console.log(rows);
			res.send(rows);
		}
	)
})	

app.get('/device/add', function(req, res) {
	let r = {
		'username': req.query.username,
		'device_id': req.query.device_id,
		'location': req.query.loc,
		'wallet_address': req.query.wallet_address
	}
	let query = connection.query(
		'insert into front set ?', r, 
		function(err, rows, cols) {
			if (err) {
				console.log(err);
			}
			console.log('done!');
		}
	)
	res.end();
})

app.get('/device/delete', function(req, res) {
	let r = {
		'device_id': req.query.device_id
	}
	let query = connection.query(
		'delete from front where ?', r,
		function(err, rows, cols) {
			if(err) {
				console.log(err);
			}
			console.log('done');
		}
	)
	res.end();
})

app.get('/api/list', async(req, res) => {
	let r = {
		count: req.query.count || 128
	}
	let query = connection.query(
		`select * from back order by time DESC limit ${r.count}`, 
		async function(err, rows, cols) {
			if(err) {
				console.log(err);
			}
			let data = await Promise.all( rows.map( async (item) => {
				let tx = await web3.eth.getTransaction(item.hash);
				let entry = web3.eth.abi.decodeParameters(
					['string', 'uint256', 'uint256', 'uint256'], tx.input
				);
				return( {
					'location': entry['0'],
					'pm25': entry['1'].toString(),
					'pm10': entry['2'].toString(),
					'time': entry['3'].toString()
				})
			}) )
			console.log(data);
			res.send(data);
		}
	)
});

app.get('/data', function(req, res){
  let r = {
	'device_id': req.query.device_id || '',
	'pm25': req.query.pm25,
	'pm10': req.query.pm10
  }

  console.log(r);

  /* Find device entry */
  connection.query(
  	'select * from front where device_id=?', r.device_id, 
	function(err, rows, cols) {
	  if (err) {
		console.log(err);
	  }
	  let fromAddress = "0x0164214FF43A46c8ad6C399811576ABFaB68FA42";
	  let toAddress = rows[0].wallet_address;
	  let amount = web3.utils.toHex(1e15);

	  /* Send transaction. */
	  web3.eth.getTransactionCount(fromAddress)
	  .then((count) => {
	  	if (count <= prev) {
			count = prev + 1;
		}
		prev = count;
		let rawTransaction = {
		  'from': fromAddress,
		  'gasPrice': web3.utils.toHex(20*1e9),
		  'gasLimit': web3.utils.toHex(210000),
		  'to': config.address,
		  'value': 0x00,
		  'data': dusttoken.methods.transfer(toAddress, amount).encodeABI(),
		  'nonce': web3.utils.toHex(count)
		}
		let transaction = new Tx(rawTransaction);
		transaction.sign(privateKey);
		web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
		.on('transactionHash', (hash)=> {

		});
	  })

	  let loc = rows[0]['location'] || '';
	  let pm25 = r.pm25;
	  let pm10 = r.pm10;
	  let time = Date.now();

	  /* Save data to transaction. */
	  web3.eth.getTransactionCount(fromAddress)
	  .then((count) => {
	    if (count <= prev)
		  count = prev + 1;
		prev = count;
		let rawTransaction = {
		  'from': fromAddress, 
		  'gasPrice': web3.utils.toHex(20*1e9),
		  'gasLimit': web3.utils.toHex(210000),
		  'to': toAddress,
		  'value': 0x00,
		  'data': web3.eth.abi.encodeParameters(['string', 'uint256', 'uint256', 'uint256'], [loc, pm25, pm10, time]),
		  'nonce': web3.utils.toHex(count)
		}
		let transaction = new Tx(rawTransaction);
		transaction.sign(privateKey);
		web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
		.on('transactionHash', (hash) => {
		  let d = {
		    'device_id': r.device_id,
			'hash': hash || ''
		  }

		  connection.query(
		    'insert into back set ?', d, 
			function(err, rows, cols) {
			  if(err)
			    console.log(err);
			  console.log('Inserted');
			}
		  );

		});
	  });
	}
  )
  res.send('Received');
})

app.listen(3001, () => console.log('Listening on port 3001'));

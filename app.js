const express = require('express')
const path = require('path');
let async = require('async');
const app = express()
const port = 3000

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/count', (req, res) => {
	require('./db').connect().then(function(results){

		results.collection.countDocuments().then(function(count){
		    	results.collection.find({status: {$gt: 200} }).toArray(function(err, docs) {
					
					res.send({ 
						data: {
							total: count, broken: docs 
						}
					});
			        results.client.close();
				})
		});
	})
});

app.get('/count2', (req, res) => {
	require('./db').connect().then(function(results){

		results.collection.countDocuments().then(function(total){
		    	results.collection.countDocuments({status: {$exists: true} }).then(function(scanned){
		    		results.collection.countDocuments({status: {$gt: 200} }).then(function(broken){
					
							res.send({ 
								data: {
									total: total, scanned: scanned, broken: broken
								}
							});
					        results.client.close();
					})
		    	});
		});
	})
});

//[{$match: {status: {$gt: 200 } } }, {$count: "broken"}, {$match: {status: {$gt: 200 } } }, {$count: "good"} ]
app.get('/broken', (req, res) => {
	require('./db').connect().then(function(results){
		results.collection.find({status: {$gt: 200} }).toArray(function(err, docs) {
			res.send({scanned:docs});
	        results.client.close();
		})
	})
});

app.get('/urls', (req, res) => {
	require('./db').connect().then(function(results){
		results.collection.find({status: {$exists: true} }).sort( { status: -1 } ).toArray(function(err, docs) {
			res.send({scanned:docs});
	        results.client.close();
		})
	})
});

app.listen(port, () => console.log(`Example app listening http://127.0.0.1:${port}`))

let db = require('./db');
//db.cleardb();
db.count();
db.create({url: 'https://www.bestbuy.com'});

db.count();

// require('./db').connect().then(function(results){
// 	results.collection.find({ metrics: { $exists: false } }).toArray(function(err, docs) {
//         results.client.close();
// 	})
// })
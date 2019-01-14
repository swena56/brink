const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const database_name = 'mydb1';

module.exports = {
  connect: function(){
      return new Promise((resolve,reject)=>{
      MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true },function(err, client) {
        if( err ){
          reject(err);
        }
        resolve({client: client,collection: client.db(database_name).collection('url')});
      });
    })
  },

  //does not return data
  count: function(){
    this.connect().then(function(results){
      results.collection.countDocuments().then(function(count){
        console.log(count);
      })
      results.client.close();
    })
  },

  cleardb: function(){
    return this.connect().then( conn => {
      conn.client.db(database_name).dropDatabase().then(function(){
        conn.close();  
      })
    });
  },

  create: function(url){
    this.connect().then( conn => {
      conn.collection.updateOne({ url : url.url }, { $set: url }, {upsert: true}, function(err, result) {
          conn.client.close();
        });
    });
  },

 

  find: function(url_obj,limit=1){
    return new Promise((resolve,reject)=>{
      this.connect().then((conn)=>{
          conn.collection.find(url_obj,{limit: limit}).toArray(function(err, docs) {
            conn.client.close();  
            resolve(docs);
          });
      });
    });
  },

};

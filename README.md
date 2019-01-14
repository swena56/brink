Backend crawl engine

## Set up Mongo DB ## 
brew install mongodb
mongo

show dbs

db.createCollection( "url", {
   validator: { $jsonSchema: {
      bsonType: "object",
      required: [ "url" ],
      properties: {
         url: {
            bsonType: "string",
            description: "https",
            //pattern?
         },
         status: {
            bsonType : "string",
            description: "http status"
         },
         date: {
         	bsonType : "string",
            description: "date found"
         },
      }
   } }
} )

db.url.insert( { url: "https://www.bestbuy.com" } )


## pm2 for server management ##

## express ##

const HCCrawler = require('headless-chrome-crawler');
var fs = require('fs');
const db = require('./db');
//read from list, add to queue

(async () => {
  const crawler = await HCCrawler.launch({
    // Function to be evaluated in browsers
    evaluatePage: (() => ({
      title: $('title').text(),
      //sku_items: $$('.sku-item').length,
      //is_pdp: $$('#pdp-content').length,
    })),
    // Function to be called with evaluated results from browsers
    onSuccess: (result => {
      console.log(result);
      let page_type = 'home';

      db.insert({
        url: result.options.url, 
        status: result.response.status,
        title: result.result.title,
        page_type: page_type,
      });
      
      let objs = result.links.map(function(data){
        return {url: data }; 
      });

      db.insertBulk(objs);
    }),
  });
  // Queue a request
  console.log("Crawling...");
  await crawler.queue('https://www.bestbuy.com');
  // Queue multiple requests
  // Queue a request with custom options
  // await crawler.queue({
  //   url: 'https://www.bestbuy.com',
  //   // Emulate a tablet device
  //   device: 'Nexus 7',
  //   // Enable screenshot by passing options
  //   screenshot: {
  //     path: './tmp/example-com.png'
  //   },
  // });
  await crawler.onIdle(); // Resolved when no queue is left
  await crawler.close(); // Close the crawler
})();
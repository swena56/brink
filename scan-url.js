const puppeteer = require('puppeteer');
let db = require('./db');

function scanLinks(url){
	if( url ){
		return puppeteer.launch({headless: false,args: ['--no-sandbox', '--disable-setuid-sandbox']}).then(async client => {

			const browserWSEndpoint = await client.wsEndpoint();
			client.disconnect();

			const browser = await puppeteer.connect({browserWSEndpoint});
			const context = browser.defaultBrowserContext();
			await context.overridePermissions(url, ['geolocation']);

			const page = await browser.newPage();
			await page.setRequestInterception(true);

			let console_messages = [];
			page.on('console', msg => {
				let message = {type: msg._type, msg: msg._text};
				if( ! console_messages.includes(message) ){
					console_messages.push(message);
				}
			});

			//speed up link scrap
			page.on('request', request => {
				let req_url = request.url();
				
				if( req_url.includes(".gif") || req_url.includes(".png") || req_url.includes("widget-email-submission") ){
					request.abort();
				} else {
					request.continue();
				}
			});

			let responses = [];
			page.on('response', response => {
				if( response._status != 200 ){

					let message = {
						status_code: response._status,
						url: response._url,
					};

					if( ! responses.includes(message) ){
						responses.push(message);
					}
				}
			});

			const response = await page.goto(url,  {"waitUntil" : "networkidle0", "timeout": 0});
			//console.log( response );
			const status = await response._headers.status;
			const date = await response._headers.date;
			const title = await page.title();
			const metrics = await page.metrics();

			let elements = [];
			if (await page.$('.inactive-product-message') !== null){
				const text = await page.evaluate(element => element.textContent, await page.$('.inactive-product-message'));
				elements.push({ selector: '.inactive-product-message', text: text });
			}

			if (await page.$('.VPT-title') !== null){
				const text = await page.evaluate(element => element.textContent, await page.$('.VPT-title'));
				elements.push({ selector: '.VPT-title', text: text });
			}

			db.create({
				url: url,
				status: status,
				date: date,
				title: title,
				console_messages: console_messages,
				responses: responses,
				metrics: metrics,
				elements: elements,
				level: null,
			});

			let links = await page.$$eval('a', as => as.map(a => a.href));
			links = await [...new Set(links)].filter( o => o.includes('https://') &&
					o.includes('www.bestbuy.com') && 
					! o.includes('javascript') && 
					! o.includes('#tab=reviews') &&
					! o.includes('#tabbed-customerreviews') 
			);

			await browser.close();
			
			return links;	
		});
	}
}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

//if base link is not added, add now



//db.cleardb();
//db.create({url:'https://www.bestbuy.com'});

function test(){
	db.count();

	let items = db.find({ title: { $exists: false } },1);
	items.then( item => {

		let url = ( item.length ) ? item[0] : 'https://www.bestbuy.com';
		console.log(url.url);

		scanLinks(url.url).then( links => {
			if( links ){
				for(var j = 0, length2 = links.length; j < length2; j++){
					db.create({
						url: links[j],
					})
				}
			}
		});
	});	
}

function getStatus(){
	const fetch = require('node-fetch');
	let items = db.find({ status: { $exists: false } },50);
	items.then( item => {
		for(var j = 0, length2 = item.length; j < length2; j++){
			let url = item[j].url;
			try{
				fetch(url).then(response => {
					db.create({url: url, status: response.status});
					console.log(response.status, url);
			});	
			} catch(e) {
				console.log(e);
			}
			
		}
	});	
}

//bash -c 'while [ 0 ]; do node scan-url.js; done'
test();
getStatus();


// let async = require('async');
// const https = require('https');
// const request = require('request');

//update status
// const fetch = require('node-fetch');
// let items = db.connect().then( conn => {
// 	let docs =  conn.collection.find().toArray( ( err, docs ) => { return docs; } );
// 	conn.client.close();
// 	console.log(docs);
// 	return docs;
// });

// items.then( item => console.log(item) );


// db.connect()({ status: { $exists: false } },150).then(async function(i){
// 	for(var j = 0, length2 = i.length; j < length2; j++){
// 		let url = i[j].url;
// 		fetch(url).then(response => db.create({url: url, status: response.status});
// 	}
// });
//count({status: { $exists: true }})
// let items = require('./db').find({ metrics: { $exists: false } },1);
// items.then(async function(i){

// 	async.eachSeries(i, async (text) => {     
// 			//console.log(text);

// 			await scanUrl(text.url).then(function(o){

// 						let links = o.links;

// 						delete o.links;
						
// 						require('./db').update({ url: o.url, status: o.status}, function(o){
// 							//console.log(o);
// 						});

// 						links.forEach(function(l){
// 							require('./db').update({url: l}, function(o){
// 								//console.log(o);	
// 							});	
// 						})

// 						return Promise.resolve()
// 				});
//     })
// });







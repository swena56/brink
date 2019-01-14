const https = require('https');
const fetch = require('node-fetch');
const url = "https://www.bestbuy.com/site/home-appliances/irons-steamers-sewing-machines/pcmcat305400050001.c?id=pcmcat305400050001";
// https.get(url, (res) => {
//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);

//   // res.on('data', (d) => {
//   //   process.stdout.write(d);
//   // });

//   res.on('end', (d) => {
//     console.log(d);
//   });

// }).on('error', (e) => {
//   console.error(e);
// });



function fetchStatus(url) {
  return fetch(url).then(response => response.status);
}

function check_http_status(url){
	return new Promise((resolve, reject)=>{
		https.get(url, (res) => {
		  console.log('statusCode:', res.statusCode);
		  console.log('headers:', res.headers);

		  resolve( res.statusCode );
		  res.on('data', (d) => {
		    process.stdout.write(d);
		  });

		}).on('error', (e) => {
		  console.error(e);
		  reject(e);
		});
	});
}


// let status = fetchStatus(url);
// status.then( o => console.log(o) ).catch( e => console.log(e));
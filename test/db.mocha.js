const assert = require('assert');
const expect = require('chai').expect;

describe('test mongo database', function () {
	
	it('should connect', function (done) {
		require('../db').connect().then(function(client){
			assert.notEqual(client, null);
			client.close();
			done();
		});
	});

	it('should be empty', function (done) {
		require('../db').count().then(function(count){
			expect(count,"Count is greater than 0").to.be.equal(0);
			done();
		});
	});

	it('should insert bulk', function (done) {

		let urls = [
			{ url: 'https://www.bestbuy.com'},
			{ url: 'https://deals.bestbuy.com'},
		];

		require('../db').insertBulk(urls);
		done();
	});

	it('search for url', function (done) {
		
	});

	it('get list of 200 status codes', function (done) {
		
	});
});
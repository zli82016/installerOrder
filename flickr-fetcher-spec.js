var expect = require('chai').expect;
var FlickrFetcher = require('./flickr-fetcher.js');

describe('#installerOrder()', function(){
	it('should take an array of strings defining dependencies', function(){
		let input = ['KittenService: CamelCaser', 'CamelCaser: '];
		let expected = 'CamelCaser, KittenService';
		let actual = FlickrFetcher.installerOrder(input);
		expect(actual).to.equal(expected);
	});
	it('should take an array of a couple of strings defining dependencies', function(){
		let input = ['KittenService: ','Leetmeme: Cyberportal','Cyberportal: Ice','CamelCaser: KittenService','Fraudstream: Leetmeme','Ice: '];
		let expected = 'KittenService, Ice, CamelCaser, Cyberportal, Leetmeme, Fraudstream';
		let actual = FlickrFetcher.installerOrder(input);
		expect(actual).to.equal(expected);
	});
});


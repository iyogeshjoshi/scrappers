/**
 * Scrapper for teacher pay teacher
 * @author Yogesh Joshi<iyogeshjoshi@gmail.com>
 */

var fs = require('fs');
var stringify = require('csv-stringify');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');


// Number of pages
var COUNT = 1;
var LIMIT = 500;

var URL = 'https://www.teacherspayteachers.com/Browse/Seller/Order:Best-Seller-All-Time/Page:';
var createUrl = function(page) {
	return URL + page;
};

var stack = [];
// var data = [];

var getData = function($, cb) {
	var datas = [];
	// var getSubjects = function()
	async.series([
	  function(callback){
	  	var data = [];
	  	$('.product_item.seller').each(function(index, item) {
	  		var data = {
	  			'Name': $(item).find('.description_part .title.bold a').text(),
	  			'Location': $(item).find('.description_part .categories_wishlist_part .categories_part .categories .category_item:nth-child(1) .category_values').html().trim(),
	  			'Subjects': $(item).find('.description_part .categories_wishlist_part .categories_part .categories .category_item:nth-child(2) .category_values a').text().trim(),
	  			'Grades': $(item).find('.description_part .categories_wishlist_part .categories_part .categories .category_item:nth-child(3) .category_values a').text().trim(),
	  			'Posted Products': $(item).find('.description_part .categories_wishlist_part .categories_part .categories .category_item:nth-child(4) .category_values').html().trim(),
	  			'Ratings': $(item).find('.rating_part .rating_number').text().trim().split(' ')[0],
	  			'Votings': $(item).find('.rating_part .rating_number').text().trim().split(' ')[1]
	  		};
	  		datas.push(data);
	  		// all.push(data);
	  		// appendToFile(entry);
	  	});
			callback();
	  }
	], function(err, results){
		if(err) cb(err);
		else {
			// console.log(results);
			appendToFile(datas);
			// cb(null, datas);
			// appendToFile(datas);
			// cb();
		}
	});
};

// appends data to file
var appendToFile = function(data) {
	var File = './list_1_to_500.csv';
	// var File = './list_501_to_1000.csv';
	var content = stringify(data, {header: true}, function(err, output){
		console.log(output);
		fs.appendFileSync(File, output, {encoding: 'utf8'});
	});
};

// get details of url
var getDetails = function(url, cb) {
	console.log('fetching from ' + url);
	request(url, function(error, res, body) {
		if(error) console.error(error); //cb(err);
		var $ = cheerio.load(body, {
			normalizeWhitespace: true,
			xmlMode: false,
			decodeEntities: true
		});

		getData($, function(err, data){
			if(err) cb(err);
			// appendToFile(data);
			cb();
		});
	});
};

// make call to urls
var makeCalls = function(lists) {
	console.log('got list!!');
	async.each(lists, getDetails, function(err){
		// body
		console.log(data);
	});
};

// create URLs
async.series([
  function(callback){
  	for(var i=COUNT;i<=LIMIT;i++) {
  		var url = createUrl(i);
  		stack.push(url);
  	}
  	callback();
  },
  // function(){}
], function(err, results){
	makeCalls(stack);
});

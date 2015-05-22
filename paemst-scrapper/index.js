/**
 * scrapper for https://www.paemst.org/awardee/find_awardee
 * @author Yogesh Joshi <iyogeshjoshi@gmail.com>
 */

/*
	link:https://www.paemst.org/awardee/find_awardee?award_year=2008&award_state_id=&grade=&discipline_id=
 */

var cheerio = require('cheerio');
var csv = require('csv');
var request = require('request');
var fs = require('fs');
var parseOptions = {
	normalizeWhitespace: true,
	decodeEntities: true
};
var stringifyOptions = {
	header: true,
};

var YEAR = 1983;
var OUPTUT = 'output.csv';

// var AWARDEES = [];

// returns the query url
var query = function(year){
	return "https://www.paemst.org/awardee/find_awardee?award_year=" + year + "&award_state_id=&grade=&discipline_id=";
};

// parse the content
var parse = function(err, body, cb) {
	if(err) {
		console.error(err);
		process.exit();
	}
	var AWARDEES = [];
	// var body = '<div class="awardee_entry">                     <img alt="Charles Bertsch" src=" https://photo.paemst.org/10344/10344_portrait_thumbnail.jpg" width="75px">                  <div class="awardee_details">                     <p class="awardee_name">                           <a href="https://recognition.paemst.org/finalist_profile/10344">Charles Bertsch</a>                     </p>                     <p class="awardee_school">                        Polson Middle School                     </p>                     <p>                        Polson , Montana                     </p>                     <p class="award_categories">                        2008 Award                        | K-6 Science                     </p>                  </div>               </div><div class="awardee_entry">                     <img alt="Charles Bertsch" src=" https://photo.paemst.org/10344/10344_portrait_thumbnail.jpg" width="75px">                  <div class="awardee_details">                     <p class="awardee_name">                           <a href="https://recognition.paemst.org/finalist_profile/10344">Charles Bertsch</a>                     </p>                     <p class="awardee_school">                        Polson Middle School                     </p>                     <p>                        Polson , Montana                     </p>                     <p class="award_categories">                        2008 Award                        | K-6 Science                     </p>                  </div>               </div><div class="awardee_entry">                     <img alt="Charles Bertsch" src=" https://photo.paemst.org/10344/10344_portrait_thumbnail.jpg" width="75px">                  <div class="awardee_details">                     <p class="awardee_name">                           <a href="https://recognition.paemst.org/finalist_profile/10344">Charles Bertsch</a>                     </p>                     <p class="awardee_school">                        Polson Middle School                     </p>                     <p>                        Polson , Montana                     </p>                     <p class="award_categories">                        2008 Award                        | K-6 Science                     </p>                  </div>               </div><div class="awardee_entry">                     <img alt="Charles Bertsch" src=" https://photo.paemst.org/10344/10344_portrait_thumbnail.jpg" width="75px">                  <div class="awardee_details">                     <p class="awardee_name">                           <a href="https://recognition.paemst.org/finalist_profile/10344">Charles Bertsch</a>                     </p>                     <p class="awardee_school">                        Polson Middle School                     </p>                     <p>                        Polson , Montana                     </p>                     <p class="award_categories">                        2008 Award                        | K-6 Science                     </p>                  </div>               </div><div class="awardee_entry">                     <img alt="Charles Bertsch" src=" https://photo.paemst.org/10344/10344_portrait_thumbnail.jpg" width="75px">                  <div class="awardee_details">                     <p class="awardee_name">                           <a href="https://recognition.paemst.org/finalist_profile/10344">Charles Bertsch</a>                     </p>                     <p class="awardee_school">                        Polson Middle School                     </p>                     <p>                        Polson , Montana                     </p>                     <p class="award_categories">                        2008 Award                        | K-6 Science                     </p>                  </div>               </div>';
	console.log("parsing content of page . . . ");
	// parse content here
	var $ = cheerio.load(body, parseOptions);
	$('.awardee_details')
	.each(function(i, elem){
		// console.log(elem);
		var content = $(elem);

		var awardee = {
			name: content.find('.awardee_name a').text() || content.find('.awardee_name').text(),
			school: content.find('.awardee_school').html(),
			place: content.find('p:nth-child(3)').html(),
			category: content.find('.award_categories').html()
		};

		// console.log(awardee);
		AWARDEES.push(awardee);
		// process.exit();
	});
	console.log(AWARDEES.length + ' of awardees found!');
	cb(AWARDEES);
};

// adds data to file
var addToFile = function(err, data) {
	if(err) console.error(err);

	var options = {
		encoding: 'utf8',
		flag: 'a+'
	};

	fs.writeFile(OUPTUT, data, options, function(err){
		if(err){
			console.error(err);
		}
		console.log("Data added to file!!");
	});
};

// fetch for each link from 2008 - 2012
while( YEAR <= 2012 ) {
	console.log('reading data for year ' + YEAR);

	request( query(YEAR++), function(err, res, body) {
		parse(err, body, function(data){
			console.log('Adding data for ' + YEAR + ' year to file.');
			csv.stringify(data, stringifyOptions, addToFile);
			addToFile(data);
		});
	});
}


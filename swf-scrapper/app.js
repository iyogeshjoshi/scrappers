/**
 * Scrapper to download swf file from the given link
 *
 * Author: Yogesh Joshi <iyogeshjoshi@gmail.com>
 * Github:
 */

 var request = require('request'),
  cheerio = require('cheerio'),
  fs = require('fs'),
  async = require('async'),
  csv = require('csv'),
  gulp = require('gulp'),
  swiffy = require('gulp-swiffy'),
  url = require('url');

var link = 'http://illuminations.nctm.org/Search.aspx?view=search&type=ac&order=al',
  page = function(num){return '&page='+num;}; // returns page number for url

var getUrl = function(uri){
  return url.resolve(link, uri);
};

var writeToFile = function(data,cb){
  // array/object to csv conversion configs
  var stringifyOptions = {
    header: true
  };
  // output file name
  var filename = 'output/output.csv',
    flag = 'w';
  // if output file exists
  if(fs.existsSync(filename)){
    flag = 'a';
    stringifyOptions.header = false;
  }
  // convert array/Object to csv string
  csv.stringify(data, stringifyOptions, function(err, output){
    if(err) cb(err);
    //write file config options
    var fileOptions = {
      encoding: 'utf8',
      flag: flag
    };

    console.log("Writing to output file...");
    // write to file
    // fs.appendFile('output/output.csv', output, function(err){cb(err,filename);});
    cb(null, filename);
  });
};

var makeRequest = function(link, cb) {
  console.log('Requesting link: '+link);

  request(link, function(err, res, body){
    if(err) cb(err);

    var swf_links = [];

    console.log('Parsing: '+link);
    $ = cheerio.load(body);
    var elems = $('.left.info .title a');

    elems.each(function(i, elem){
      var uri = getUrl($(elem).attr('href'));
      request(uri, function(err,res,body){
        var swf = cheerio.load(body);
        // get swf link
        var swf_link = swf('embed').attr('src');
        if(swf_link){
          downloadFile(swf_link);
          // swf_links.push({'link': swf_link});
        }
      })
      swf_links.push({'link': uri});
    }).get();

    cb(null, swf_links);
  });
};

//calls makeRequest method for all pages
var callRequest = function(link, limit, cb){
  var i = 1;

  async.series([function(callback){
    while(i<=limit){
      var uri = link+page(i);
      console.log(uri);
      makeRequest(uri,function(err, res){
       if(err) callback(err);
      //  writeToFile(res, function(err, file){
      //    if(err) callback(err);
      //    console.log('Output to file: ' + file);
      //    callback(null, file);
      //  });
      });
      i++;
    }
  }],function(err, res){
    if(err) cb(err);
    cb();
  });
};

// get all the swf links from all pages
var getAllPages = function(err, res, body){
  var $ = cheerio.load(body);
  var last = $('.pager').children().last().find('a').attr('href');
  var page = url.parse(last, true).query.page;
  console.log(page);
  callRequest(link, parseInt(page), function(err, res){
    // console.log('downloading files from '+res);
    console.log('downloading swf files . . .');
    // downloadFiles(res);
  });
};
// download all the links from the csv file
var downloadFile = function(file) {
  // download file logic
  console.log('Downloading ' + file);
  var swf_link = getUrl(file);
  file.replace('/','');
  file = file.replace(new RegExp('/', 'g'),'-');
  var dest = 'output/'+file;
  var fileWrite = fs.createWriteStream(dest);
  request(swf_link, function(err,res,body){
    res.pipe(fileWrite);
    fileWrite.on('finish', function(){
      fileWrite.close();
    });
  });
}


// get all paging links
request(link, getAllPages);

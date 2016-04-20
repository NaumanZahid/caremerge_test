var express = require('express');
var app     = express();
var http    = require('http')

var PATH = '/I/want/title';

app.get(PATH, function (req, res) {

  addresses = parseURL(req.url).address;
  titles	= [];
  list_of_titles = '';
  
  get_titles(addresses, function(titles){
    console.log(titles);
    res.send(list_of_titles);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});


function parseURL(req_url){
  var url = require('url');
  var url_parts = url.parse(req_url, true);
  var query = url_parts.query;
  return query;			
}

function get_titles(addresses, onComplete) {
  getSingleTitle(addresses.shift(), onComplete);	
}

function moveToNextOrEnd(address, title, onComplete){
  titles.push({address, title });
  list_of_titles = list_of_titles + '<li> ' + address + ' - ' + title;
  if(addresses.length > 0){
    next_path = addresses.shift();
    getSingleTitle(next_path, onComplete)
  }
  else{
    onComplete(titles);
  } 
}

function extractTitle(body){
  console.log('=============================');
  var title_result = body.toString().match("<title>(.*)</title>");
  var title = '';
  if(title_result){
    title = title_result[1];
    console.log(title_result[1]);
  }
  else{
    title_result = body.toString().match("<TITLE>(.*)</TITLE>");
    if(title_result){
      title = title_result[1];
      console.log(title_result[1]);
    }
    else{
      title = 'No Title Found'.	
      console.log('No title found.');
    }
  }         		
  console.log('=============================');
  return title;
}

function getSingleTitle(address, onComplete){
  
  if (address) {
    body = '';
    title = '';
    http.get('http://'+address, function(res) {
      console.log(`Got response: ${res.statusCode}`);	
      res.on('data', function(chunk) {
	body += chunk;
      });
      res.on('end', function() {
	title = extractTitle(body);
        moveToNextOrEnd(address, title, onComplete);
        
      });
      res.resume();
     }).on('error', function(e) {
      title = 'No Response';
      moveToNextOrEnd(address, title, onComplete);	
      console.log(`Got error: ${e.message}`);
     });
  } 
}

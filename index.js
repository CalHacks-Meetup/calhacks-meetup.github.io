/* 	Requiring all middleware that app is using
	will require the API's we're using here. */
var express = require('express');

// Create an express app
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.all('*', function(req, res, next) {
  console.log("Received request from " + req.method + " to " + req.url);
  next();
});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//rendering pages
app.get('/', function(request, response) {
  response.render('public/index');
});

//if using angularjs, SPA (sending index.html only), use following:
/*app.all('/*', function(req, res, next) {
  //send index.html for other files to support HTML5Mode
  res.sendfile('./public/index', { root: __dirname });
});
*/

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



/* 	Requiring all middleware that app is using
	will require the API's we're using here. */
var express = require('express');
var mongo = require('mongodb');

// Create an express app
var app = express();

app.set('port', (process.env.PORT || 8000));

app.use(express.static(__dirname + '/public'));

app.all('*', function (req, res, next) {
  console.log("Received request from " + req.method + " to " + req.url);
  next();
});

// Rendering pages
app.get('/', function (req, res) {
  res.render('public/index');
});

app.get('/signin', function (req, res) {
	res.render('public/dashboard');
})

app.get('/signout', function (req, res) {
	res.render('public/index');
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
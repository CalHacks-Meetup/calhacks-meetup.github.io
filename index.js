/* 	Requiring all middleware that app is using
	will require the API's we're using here. */
var express = require('express');
var oauth = require('oauth');
var mongo = require('mongodb');
var gcal = require('google-calendar');
var q = require('q');

// Create an express app
var oa;
var app = express();
var clientId = 'GOOGLE_CLIENT_ID';
var clientSecret = 'GOOGLE_CLIENT_SECRET';
var scopes = 'https://www.googleapis.com/auth/calendar';
var googleUserId;
var refreshToken;
var baseUrl;


app.set('port', (process.env.PORT || 8000));

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


// DATABASE SET UP 
var mongoCollectionName = 'MONGO_COLLECTION_NAME';
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/default';

function connect(callback) {
	var deferred = q.defer();
	if (database == undefined) {
		mongo.Db.connect(mongoUri, function (err, db) {
			if (err) deferred.reject({error: err});
			database = db;
			deferred.resolve();
		});
	} else {
		deferred.resolve();
	}
	return deferred.promise;
}

// GOOGLE AUTHORIZATION
function authorize() {
	var deferred = q.defer();
	oa = new oauth.OAuth2(clientId, 
		clientSecret, "https://accounts.google.com/o", 
		"/oauth2/auth", "/oauth2/token");
	if (refreshToken) {
		oa.getOAuthAccessToken(refreshToken, 
			{grant_type: 'refresh_token', clientId: clientId, 
			client_secret: clientSecret}, 
			function(err, access_token, refresh_token, res) {
				// Lookup settings from database
				connect().then(function() {
					database.collection(mongoCollectionName).findOne(
						{google_user_id: googleUserId}, 
						function(findError, settings) {
							var expiresIn = parseInt(res.expires_in);
							var accessTokenExpiration = new Date().getTime() + (expiresIn*1000);
							// Add refresh token if it is returned
							if (refresh_token != undefined) {
								settings.google_refresh_token = refresh_token;
							}
							// Update access token in database
							settings.google_access_token = access_token;
							settings.google_access_token_expiration = accessTokenExpiration;
							database.collection(mongoCollectionName).save(settings);
							deferred.resolve(access_token);
						});
				});
			})
	} else {
		deferred.reject({error: 'Application needs authorization.'});
	}
	return deferred.promise;
}
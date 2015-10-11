/* 	Requiring all middleware that app is using
	will require the API's we're using here. */
var express = require('express');
var mongodb = require('mongodb');

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

var mongoURI = 'mongodb://heroku_qj31q6f7:gm6hos3f52u9s5mqk461rehcv0@ds035664.mongolab.com:35664/heroku_qj31q6f7';

mongodb.MongoClient.connect(mongoURI, function(err, db) {
  
  if(err) throw err;
  
  /*
   * First we'll add a few songs. Nothing is required to create the 
   * songs collection; it is created automatically when we insert.
   */

  var meetings = db.collection('meetings');

   // Note that the insert method can take either an array or a dict.

  songs.insert(seedData, function(err, result) {
    
    if(err) throw err;

    /*
     * Then we need to give Boyz II Men credit for their contribution
     * to the hit "One Sweet Day".
     */

    songs.update(
      { song: 'One Sweet Day' }, 
      { $set: { artist: 'Mariah Carey ft. Boyz II Men' } },
      function (err, result) {
        
        if(err) throw err;

        /*
         * Finally we run a query which returns all the hits that spend 10 or
         * more weeks at number 1.
         */

        songs.find({ weeksAtOne : { $gte: 10 } }).sort({ decade: 1 }).toArray(function (err, docs) {

          if(err) throw err;

          docs.forEach(function (doc) {
            console.log(
              'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] + 
              ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
            );
          });
         
          // Since this is an example, we'll clean up after ourselves.
          songs.drop(function (err) {
            if(err) throw err;
           
            // Only close the connection when your app is terminating.
            db.close(function (err) {
              if(err) throw err;
            });
          });
        });
      }
    );
  });
});
module.exports = function (app) {
var mongodb = require('mongodb');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UsersSchema = new Schema({
  name: String,
  allFreeTimes: Array,
});

var Users = mongoose.model('Users', UsersSchema);

var mongoURI = 'mongodb://heroku_qj31q6f7:gm6hos3f52u9s5mqk461rehcv0@ds035664.mongolab.com:35664/heroku_qj31q6f7';

mongodb.MongoClient.connect(mongoURI, function(err, db) {
  if (err) throw err;
  
  var usersCollection = db.collection('users');
});

var users = new Users({ name: String,
                        allFreeTimes: Array,
          });

var freeTimesSchema = new Schema({start: Number, 
        end: Number, 
        preLoc: String, 
        postLoc: String,
       });

var freeTime = mongoose.model('freeTime', freeTimesSchema);


var chuFreeTime = new freeTime({ start: '2015-10-09T19:00:00-07:00', end: '2015-10-09T11:00:00-07:00', preLoc: 'Wheeler', postLoc: 'Evans'});
var chuFreeTime1 = new freeTime({ start: '2015-10-09T19:00:00-07:00', end: '2015-10-09T08:00:00-07:00', preLoc: 'LiKaShing', postLoc: 'Evans'});

var chuBuggy = new Users({ name: 'ChuBuggy', allFreeTimes: [chuFreeTime, chuFreeTime1]});

chuBuggy.save(function(err, chuBuggy) {
  if (err) return console.error(err);
  console.dir(chuBuggy);
});
};

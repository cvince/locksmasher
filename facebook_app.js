var async = require('async');
var util = require('util');

var resourceDir = __dirname + '/resources/views/';

var express = require('express');
var fb = require('faceplate');

var app = express.createServer(
	express.bodyParser()
,	express.cookieParser()
,	require('faceplate').middleware({
		app_id: '414034551944593'
	,	secret: '19058fa4b4f2727a07c4f3e15d5df294'
	,	scope:  'uid, name,pic_square,is_app_user,user_likes,user_photos,user_photo_video_tags'
	})
,	express.static(__dirname + '/resources/public')
);

app.get('/', function(req, res) {
	res.sendfile(resourceDir + 'login.html');
});

app.get('/profile', function(req, res) {
	res.sendfile(resourceDir + 'index.html');
});

var arduino = require('duino'),
    board = new arduino.Board();

	var led = new arduino.Led({
	  board: board,
	  pin: 13
});

app.post('/lock', function(req, res) {
	res.end();
	if (req.body.state === 'unlock') {
		console.log("door unlocked");
		led.on();
	} else {
		console.log("door locked");
		led.off();
	}
});

app.post('/request', function(req, res) {
	console.log(req.body.lockID);
	res.end();
});

	
// show friends
app.get('/friends', function(req, res) {
	// THERE IS AN ISSUE HERE. Either we are not asking for the right permissions.
	// OR the asscess_id is expiring

	// req.facebook.get('/me/friends', { limit: 10 }, function(friends) {
	// 	//res.send('friends: ' + util.inspect(friends));	
	// });
	req.facebook.fql('SELECT uid, name, is_app_user, pic_square FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1', function(response) {
		res.send('friends: ' + util.inspect(response));
	});
});

app.listen(12340);

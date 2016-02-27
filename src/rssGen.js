var app = require('../api/api');
var mongoose = require('mongoose');
// var mongoURI = process.env.NODE_ENV !== 'production' ? require('../api/authentication/mongoCredentials').mongoURI : process.env.mongoURI;
// mongoose.connect(mongoURI);  

var RSS = require('rss');
var Pub  = require('../api/models').Pub;

app.get('/rss.xml', function(req,res){
	console.log('Sweet');
});

// export function generateRSS(req, res) {
// 	console.log('were hrere');
// 	var objects = [];
// 	var query = {history: {$not: {$size: 0}},'settings.isPrivate': {$ne: true}};
// 	if(req.query.journalID){
// 		query['featuredInList'] = req.query.journalID;
// 	}

// 	Pub.find(query, {'slug':1, 'title':1, 'abstract': 1}).lean().exec(function (err, pubs) {
// 		console.log(pubs)
// 	});
// 	// var feed = new RSS(feedOptions);
// }

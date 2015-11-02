var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:kevinisacuteboy@ds045121-a0.mongolab.com:45121,ds045121-a1.mongolab.com:45121/pubpub_production?replicaSet=rs-ds045121');



require('../server.babel'); // babel registration (runtime transpilation for node)

import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import PrettyError from 'pretty-error';
import http from 'http';
import request from 'request';

const pretty = new PrettyError();
const app = express();

const server = new http.Server(app);


app.use(session({
	secret: 'react and redux rule!!!!',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 60000 }
}));
app.use(bodyParser.json());


var Pub  = require('./models').Pub;
var User = require('./models').User;

app.get('/sampleProjects', function(req, res){
	Pub.find({}, {'displayTitle': 1, 'uniqueTitle': 1})
	.limit(5)
	.exec(function(err, pubs){
		// console.log('yea were here');
		res.status(201).json(pubs);
	});

});


app.post('/loadProjects', function(req,res){
	// Want to load each project's title, authors, publishdate, abstract, image
	console.log(req.body);
	Pub.find({'uniqueTitle': {$in: req.body}}, { '_id': 0, 'collaboratorsUsers': 1, 'image':1, 'displayTitle':1, 'uniqueTitle':1, 'versions':1})
		.populate({ path: 'collaboratorsUsers.authors', select: 'username name image'})
		.populate({ path: "versions", select: 'abstract'})
		.lean()
		.exec(function (err, pubs) {
			pubs.forEach(function(pub){
				pub['abstract'] = pub.versions[pub.versions.length-1].abstract;
				delete pub.versions;
			});
			
			res.status(201).json(pubs);
		});
	

});

app.post('/loadProject', function(req,res){
	console.log('in Load project backend')
	Pub.findOne({'uniqueTitle': req.body[0]}, { '_id': 0, 'versions': 1, 'collaboratorsUsers': 1, 'image':1, 'displayTitle':1, 'uniqueTitle':1})
		.populate({ path: "versions", select: 'abstract content postDate assetTree'})
		.populate({ path: 'collaboratorsUsers.authors', select: 'username name image'})
		.lean()
		.exec(function (err, pub) {

			var output = {
				displayTitle: pub.displayTitle,
				uniqueTitle: pub.uniqueTitle,
				image: pub.image,
				abstract: pub.versions[pub.versions.length-1].abstract,
				content: pub.versions[pub.versions.length-1].content,
				postDate: pub.versions[pub.versions.length-1].postDate,
				authors: pub.collaboratorsUsers.authors,
			}

			if(pub.versions[pub.versions.length-1].assetTree != undefined){
				var assetTree = JSON.parse(pub.versions[pub.versions.length-1].assetTree);
				output.content = output.content.replace(/\^\^asset{(.*?)}/g, function(match, capture) {
					return '!['+capture+']('+assetTree[capture]+')';
				});
			}
			output.content = output.content.replace(/\^\^(.*?){(.*?)}/g, '');  
			output.content = output.content.replace(/\^\^pagebreak/g, '');  
			output.content = output.content.replace(/(#+)/g, function(match, capture) {
					return match+' ';
				});
			
			
			res.status(201).json(output);
		});

});




if (config.apiPort) {
	const runnable = app.listen(config.apiPort, (err) => {
		if (err) {
			console.error(err);
		}
		console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
		console.info('==> 💻  Send requests to http://localhost:%s', config.apiPort);
	});


} else {
	console.error('==>     ERROR: No PORT environment variable has been specified');
}

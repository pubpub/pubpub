var app = require('../api');
var RSS = require('rss');

var Pub  = require('../models').Pub;
var Journal  = require('../models').Journal;

app.get('/rss.xml', function(req,res){
	var host = req.headers.host.split(':')[0];
	Journal.findOne({ $or:[ {'subdomain':host.split('.')[0]}, {'customDomain':host}]})
	.lean().exec(function(err, journal){
		var title = journal ? journal.journalName : 'PubPub';
		var journalURL = '';
		if (journal) {
			journalURL = journal && journal.customDomain ? 'http://' + journal.customDomain : 'http://' + journal.subdomain + '.pubpub.org';	
		}
		var baseURL = journal ? journalURL : 'http://www.pubpub.org';
		var description = journal ? journal.description : 'PubPub is a platform for totally transparent publishing. Read, Write, Publish, Review.';
		var imageURL = journal ? journal.journalLogoURL : 'https://s3.amazonaws.com/pubpub-upload/pubpubDefaultTitle.png';

		var feed = new RSS({
		    title: title,
		    description: description,
		    feed_url: baseURL + 'data/rss.xml',
		    site_url: baseURL,
		    image_url: imageURL,
		});

		var query = {history: {$not: {$size: 0}}};
		if(journal){
			query['featuredInList'] = journal._id;
		}

		Pub.find(query, {'slug':1, 'title':1, 'abstract': 1, 'lastUpdated': 1, 'authors': 1})
		.populate({ path: 'authors', select: 'name firstName lastName', model: 'User' })
		.lean().exec(function (err, pubs) {
			pubs.forEach((pub)=>{
				var authorString = pub.authors.reduce((previousValue, currentValue, currentIndex, array)=>{
					const lastName = array[currentIndex].lastName || 'Lastname';
					const firstName = array[currentIndex].firstName ? array[currentIndex].firstName.charAt(0) + '.' : 'F.';
					const authorString = array.length === currentIndex + 1 ? lastName + ', ' + firstName : lastName + ', ' + firstName + ', ';
					return previousValue + authorString;
				}, '');

				feed.item({
				    title:  pub.title,
				    description: pub.abstract,
				    url: baseURL + '/pub/' + pub.slug,
				    author: authorString,
				    date: pub.lastUpdated,
				});
			});

			res.set('Content-Type', 'text/xml');
			res.send(feed.xml());
		});
	});
	
});
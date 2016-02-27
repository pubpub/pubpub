var app = require('../api');
var RSS = require('rss');
var fs = require('fs');
import React from 'react';
import ReactDOM from 'react-dom/server';
import {PubBody} from '../../src/components';
import {convertListToObject} from '../../src/utils/parsePlugins';

import {StyleRoot} from 'radium';
import {IntlProvider} from 'react-intl';


var Pub  = require('../models').Pub;
var Journal  = require('../models').Journal;


function generateRSSXML(req, instantArticleMode, callback) {
	var host = req.headers.host.split(':')[0];
	Journal.findOne({ $or:[ {'subdomain':host.split('.')[0]}, {'customDomain':host}]})
	.lean().exec(function(err, journal){
		var title = journal ? journal.journalName : 'PubPub';
		var description = journal ? journal.description : 'PubPub is a platform for totally transparent publishing. Read, Write, Publish, Review.';
		var imageURL = journal ? journal.journalLogoURL : 'https://s3.amazonaws.com/pubpub-upload/pubpubDefaultTitle.png';

		var feed = new RSS({
		    title: title,
		    description: description,
		    feed_url: 'http://' + host + '/data/rss.xml',
		    site_url: 'http://' + host,
		    image_url: imageURL,
		});

		var query = {history: {$not: {$size: 0}}};
		if(journal){
			query['featuredInList'] = journal._id;
		}

		Pub.find(query, {'slug':1, 'title':1, 'abstract': 1, 'createDate':1 ,'lastUpdated': 1, 'authors': 1, 'authorsNote': 1, 'markdown': 1, 'assets': 1, 'references': 1})
		.populate({ path: 'authors', select: 'name firstName lastName', model: 'User' })
		.populate({ path: 'assets', model: 'Asset' })
		.populate({ path: 'references', model: 'Reference' })
		.sort({'lastUpdated': -1})
		.lean().exec(function (err, pubs) {
			if (err) { console.log(err); }

			let languageObject = {};
			const locale = journal && journal.locale ? journal.locale : 'en';
			fs.readFile(__dirname + '/../../translations/languages/' + locale + '.json', 'utf8', function (err, data) {
				if (err) { console.log(err); }

				languageObject = JSON.parse(data);
				pubs.forEach((pub)=>{
					var authorString = pub.authors.reduce((previousValue, currentValue, currentIndex, array)=>{
						const lastName = array[currentIndex].lastName || 'Lastname';
						const firstName = array[currentIndex].firstName ? array[currentIndex].firstName.charAt(0) + '.' : 'F.';
						const authorString = array.length === currentIndex + 1 ? lastName + ', ' + firstName : lastName + ', ' + firstName + ', ';
						return previousValue + authorString;
					}, '');

					const feedItem = {
					    title:  pub.title,
					    description: pub.abstract,
					    url: 'http://' + host + '/pub/' + pub.slug,
					    author: authorString,
					    guid: String(pub._id),
					    date: pub.lastUpdated,
					};

					if (instantArticleMode) {
							const assets = convertListToObject(pub.assets);
							const references = convertListToObject(pub.references, true);

							const articleHTML = ReactDOM.renderToStaticMarkup(
								<IntlProvider locale={'en'} messages={languageObject}>
									<StyleRoot>
										<PubBody 
											title={pub.title} 
											abstract={pub.abstract} 
											authorsNote={pub.authorsNote} 
											markdown={pub.markdown} 
											assetsObject={assets}
											referencesObject={references}
											authors={pub.authors}
											references={pub.references}
											firstPublishedDate={pub.createDate}
											lastPublishedDate={pub.lastUpdated} />
									</StyleRoot>
								</IntlProvider>
							);

							feedItem.custom_elements = [
						      {'content:encoded': articleHTML},
						    ];
						    feed.item(feedItem);
						

						
					} else {
						feed.item(feedItem);
					}
				});

				callback(feed.xml());

			});
		
		});
	});
}

app.get('/rss.xml', function(req,res){
	generateRSSXML(req, false, function(xmlFeed){
		res.set('Content-Type', 'text/xml');
		res.send(xmlFeed);
	});
});

// app.get('/instantarticles.xml', function(req,res){
// 	generateRSSXML(req, true, function(xmlFeed){
// 		res.set('Content-Type', 'text/xml');
// 		res.send(xmlFeed);
// 	});
// });

const app = require('../api');
const RSS = require('rss');
const fs = require('fs');
import React from 'react';
import ReactDOM from 'react-dom/server';
import {IntlProvider} from 'react-intl';

import {PubBodyRSS} from 'components';

import {Pub, Journal} from '../models';


function renderPub(languageObject, host, pub) {

	return new Promise((resolve, reject) => {

		const authorString = pub.authors.reduce((previousValue, currentValue, currentIndex, array)=>{
			const lastName = array[currentIndex].lastName || 'Lastname';
			const firstName = array[currentIndex].firstName ? array[currentIndex].firstName.charAt(0) + '.' : 'F.';
			const nextAuthorString = array.length === currentIndex + 1 ? lastName + ', ' + firstName : lastName + ', ' + firstName + ', ';
			return previousValue + nextAuthorString;
		}, '');

		const pubUrl = 'http://' + host + '/pub/' + pub.slug;

		const feedItem = {
			title: pub.title,
			description: pub.abstract,
			url: 'http://' + host + '/pub/' + pub.slug,
			author: authorString,
			guid: String(pub._id),
			date: pub.lastUpdated,
		};

		let articleHTML;
		try {
			articleHTML = ReactDOM.renderToStaticMarkup(
				<IntlProvider locale={'en'} messages={languageObject}>
					<PubBodyRSS
						title={pub.title}
						abstract={pub.abstract}
						authorsNote={pub.authorsNote}
						authorString={authorString}
						markdown={pub.markdown}
						authors={pub.authors}
						pubURL={pubUrl}
						discussionCount={pub.discussions.length}
						firstPublishedDate={pub.createDate}
						lastPublishedDate={pub.lastUpdated} />
				</IntlProvider>
			);
		} catch (err) {
			console.log('Error rendering markdown', err);
		}

		articleHTML = `<![CDATA[
			<!doctype html>
			${articleHTML}
		]]>`;

		feedItem.custom_elements = [
			{'content:encoded': articleHTML},
		];

		resolve(feedItem);

	});

}


function generateRSSXML(req, instantArticleMode, callback) {
	const host = req.headers.host.split(':')[0];
	Journal.findOne({ $or: [ {subdomain: host.split('.')[0]}, {customDomain: host}]})
	.lean().exec(function(err, journal) {
		const title = journal ? journal.journalName : 'PubPub';
		const description = journal ? journal.description : 'PubPub is a platform for totally transparent publishing. Read, Write, Publish, Review.';
		const imageURL = journal ? journal.journalLogoURL : 'https://s3.amazonaws.com/pubpub-upload/pubpubDefaultTitle.png';

		const feed = new RSS({
			title: title,
			description: description,
			feed_url: 'http://' + host + '/data/rss.xml',
			site_url: 'http://' + host,
			image_url: imageURL,
		});

		/*
		const query = {history: {$not: {$size: 0}}};
		if (journal) {
		query.featuredInList = journal._id;
		}
		*/

		const featuredInList = (journal) ? { $in: [journal._id] } : {$not: {$size: 0}};

		const query = {
			history: {$not: {$size: 0}},
			featuredInList: featuredInList,
			discussions: {$not: {$size: 0}},
			'isPublished': true
		};

		Pub.find(query)
		.count()
		.exec()
		.then(function(rssCount) {

			let newQuery;
			// only pad RSS if instant articles is enabled for the journal
			if (rssCount < 10 && journal && journal.fbPagesTag) {
				const slugArray = [ 'about', 'privacy', 'hello', 'tos', 'design-as-participation', 'enlightenment-to-entanglement', 'designandscience', 'extended-intelligence', 'dbdb', 'retractions', 'SolarCoin', 'medrec'].slice(0, 14 - rssCount);
				const paddingQuery = {slug: { $in: slugArray } };
				newQuery = { $or: [query, paddingQuery] };
			} else {
				newQuery = query;
			}


			Pub.find(newQuery, {slug: 1, title: 1, abstract: 1, createDate: 1, lastUpdated: 1, authors: 1, authorsNote: 1, markdown: 1, discussions: 1})
			.populate({ path: 'authors', select: 'name firstName lastName', model: 'User' })
			.populate({ path: 'assets', model: 'Asset' })
			.limit(25)
			.sort({'lastUpdated': -1})
			.lean()
			.exec()
			.then(function(pubs) {

				let languageObject = {};
				fs.readFile(__dirname + '/../../translations/languages/en.json', 'utf8', function(errFSRead, data) {
					if (errFSRead) { console.log(errFSRead); }
					languageObject = JSON.parse(data);
					Promise.all(pubs.map((pub) => renderPub(languageObject, host, pub)))
					.then(function(newPubs) {
						for (const pubItem of newPubs) {
							feed.item(pubItem);
						}
						callback(feed.xml());
					})
					.catch(function() {
						console.log('Failed to parse RSS.');
						callback(null);
					});


				});
			})
			.catch(function() {
				console.log('Failed to load RSS.');
				callback(null);
			});

		});


	});
}

export function rss(req, res) {
	generateRSSXML(req, false, function(xmlFeed) {
		res.set('Content-Type', 'text/xml');
		res.send(xmlFeed);
	});
}
app.get('/rss.xml', rss);

// app.get('/instantarticles.xml', function(req,res){
// 	generateRSSXML(req, true, function(xmlFeed){
// 		res.set('Content-Type', 'text/xml');
// 		res.send(xmlFeed);
// 	});
// });

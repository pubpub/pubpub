import mongoose from './connectMongo';
import {connectFirebase} from './connectFirebase';
import {queue} from 'async';
import oldAsset from './oldModels/old-asset-model';
import Reference from './oldModels/old-reference-model';
import Pub from './oldModels/old-pub-model';
import NewPub from '../models/pub-model';

import User from '../models/user-model';
import Discussion from './oldModels/old-discussion-model';

import {refactorTitleFirebase, refactorTitleMongo} from './processors/titleRefactor';
import widgetProcessor from './processors/widgetReplace';
import {assetRefactorPub} from './processors/assetRefactor';

const Firepad = require('firepad');


export function migrateAllPubText(PUBS_TO_MIGRATE, DO_FIREBASE) {

	const errorPubs = [];
	let migrateCount = 0;

	connectFirebase(function(ref) {

		var mongoQueue = queue(migrateSinglePub, 1);
		// var firebaseQueue = queue(migrateSinglePubFirebase, 2);

		// testing slugs: VidVid-Moving_images_in_context

		// console.log(mongoose.modelNames());

		// const cursor = Pub.find({slug: 'newsclouds'})
		const cursor = Pub.find({})
		//const cursor = Pub.find({slug: 'VidVid-Moving_images_in_context'})
		.populate({ path: 'assets history.assets', model: 'oldAsset' })
		.populate({ path: 'references history.references', model: 'oldReference' })
		.populate({ path: 'authors history.authors', select: 'username name thumbnail firstName lastName', model: 'User' })
		.exec(function(err, pubs) {
			for (let pub of pubs) {

				if (err || !pub || migrateCount >= PUBS_TO_MIGRATE) {
					return;
				}

				/*
				oldAsset.find({'_id': { $in: pubs.assets}}).exec(function(err, assets) {
					console.log('Got assets!');
					console.log(assets);
				});
				*/

				// console.log(pub);
				// console.log(pub.assets);
				// console.log(pub.references);

				// continue;
				migrateCount++;

				const assets = pub.assets;
				const references = pub.references;

				mongoQueue.push({ref, pub, assets, references, DO_FIREBASE}, function (err) {
					if (err) {
						console.log(err);
						errorPubs.push(pub);
					} else {
						console.log('finished processing ' + pub.slug);
						/*
						firebaseQueue.push({ref, pub, assets, references, processor: processor}, function (err) {
							if (err) {
								errorPubs.push(pub);
							} else {
								console.log('finished firebase processing ' + pub.slug);
							}
						});
						*/
					}
				});
				//console.log(pub);
			}
		});

		mongoQueue.drain = function() {
			console.log('all pubs have been processed');
			console.log('The following pubs had errors');
			console.log(errorPubs.map((pub) => pub.title));
		}

	});

}




const migrateSinglePubFirebase = function({ref, pub, assets}, callback) {

	var childRef = ref.child(pub.slug + '/firepad');
	var headless = new Firepad.Headless(childRef);
	try {
		headless.getText(function(text) {
			try {
				let newMarkdown = refactorTitleFirebase({pub, markdown: text, authors: pub.authors});
				newMarkdown = widgetProcessor({markdown: newMarkdown, assets: assets});

				try {
					headless.setText(newMarkdown, function() {
						console.log(' - set firepad');
						callback();
					});
				} catch (err1) {
					console.log(' -! error with firepad');
					console.log(err1);
					callback(err1);
				}

			} catch (err) {
				console.log(' -! error with text!');
				console.log(err2);
				callback(err);
			}


		});
	} catch (err) {
		callback(err);
	}

};

const migrateSinglePub = function({ref, pub, assets, references, DO_FIREBASE}, callback) {

	console.log('started processing ' + pub.slug);

	var newDoc = JSON.parse(JSON.stringify(pub));

	const processorCallback = (err, newAssets) => {
		if (err) {
			// console.log(newAssets);
			// console.log(arguments);
			callback(err);
			return;
		}
		newAssets = newAssets || [];
		try {
			if (pub.markdown) {
				newDoc.markdown = refactorTitleMongo({pub: newDoc, markdown: newDoc.markdown, authors: newDoc.authors});
				newDoc.markdown = widgetProcessor({markdown: newDoc.markdown, assets: newAssets});
			}

			// migrateSinglePubFirebase({ref, pub, assets: newAssets}, callback);

			newDoc.StyleDesktop = newDoc.StyleRawDesktop
			newDoc.StyleRawDesktop = undefined;

			newDoc.StyleMobile = newDoc.StyleRawMobile
			newDoc.StyleRawMobile = undefined;

			newDoc.status = undefined;
			newDoc.isPublished = (newDoc.history.length >= 1);
			newDoc.settings = undefined;


			for (let history of newDoc.history) {
				history.versionNote = history.publishNote;
				history.versionDate = history.publishDate;
				history.versionAuthor = history.publishAuthor;
				history.publishNote = undefined;
				history.publishDate = undefined;
				history.publishAuthor = undefined;
				history.diffStyleDesktop = history.styleRawDesktop;
				history.diffStyleMobile = history.styleRawMobile;
				history.styleRawDesktop = undefined;
				history.styleRawMobile = undefined;
				history.isPublished = true;
				history.diffObject.diffStyleDesktop = [];
				history.diffObject.diffStyleMobile = [];
				history.diffObject.diffTitle = undefined;
				history.diffObject.diffAbstract = undefined;
				history.diffObject.diffAuthorsNote = undefined;
				history.diffObject.additions = 0;
				history.diffObject.deletions = 0;
				history.diffObject.diffMarkdown = [];

				history.tags = [];
				history.style = undefined;
				let newHistoryMarkdown = history.markdown;
				newHistoryMarkdown = refactorTitleMongo({pub: {title: history.title, abstract: history.abstract, authorsNote: history.authorsNote, slug: pub.slug}, markdown: newHistoryMarkdown, authors: history.authors});
				history.markdown = widgetProcessor({markdown: newHistoryMarkdown, assets: newAssets});
			}

			Discussion.update({ _id: {$in: pub.editorComments}}, {$set:{"private":true}}, {upsert: false, multi: true}, function(err,numAffected) {

				if (err) {
					console.log(err);
					callback(err);
					return;
				}
				console.log('- Updated editor discussion comments');

				// console.log(newDoc);

				NewPub.create(newDoc, function(err2, results) {
					if (err2) {
						callback(err2);
						return;
					}
					if (DO_FIREBASE) {
						migrateSinglePubFirebase({ref, pub: newDoc, assets: newAssets}, callback);
					} else {
						callback(err);
					}
					// callback(err);
				});

			});

		} catch (err1) {
			callback(err1);
		}


	};


	assetRefactorPub({pub: pub, assets: assets || [], references: references || [], callback: processorCallback});

}

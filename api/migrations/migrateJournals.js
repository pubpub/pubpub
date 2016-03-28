import mongoose from './connectMongo';
import Journal from '../models/journal-model';
import Pub from '../models/pub-model';
const Firebase = require('firebase');
import {fireBaseURL, generateAuthToken} from '../services/firebase';

// - landingPage field created with PubID pointing to a page pub
// - locale, string, set to ‘en’ for everything
// - customLanguage messages, empty string

export function migrateJournals () {

	Journal.find({}).exec(function(err, journals) {
		for (let journal in journals) {
			journal.locale = journal.locale || 'en';
			journal.customLanguageMessages = '';


			const journalLandingSlug = journal.subdomain + '-landingpage'; // Guaranteed unique because we don't allow pubs to be created ending with 'landingpage' and subdomain is unique
			const journalLandingTitle = journal.journalName;
			Pub.createPub(journalLandingSlug, journalLandingTitle, journal._id, true, function(createErr, savedPub) {

				const ref = new Firebase(fireBaseURL + journalLandingSlug + '/editorData' );
				ref.authWithCustomToken(generateAuthToken(), ()=>{
					const newEditorData = {
						collaborators: {},
						settings: {styleDesktop: ''},
					};
					newEditorData.collaborators[journal.subdomain] = {
						_id: journal._id.toString(),
						name: journal.journalName + ' Admins',
						firstName: journal.journalName || '',
						lastName: 'Admins',
						thumbnail: '/thumbnails/group.png',
						permission: 'edit',
						admin: true,
					};
					ref.set(newEditorData);

					journal.landingPage = savedPub.id;

					Journal.update({_id: journal._id}, {$set: journal}}, function(err, numAffected) {
						if (err) {
							console.log(err);
						}
					});

				});
			});
		}

		console.log('looped through them all');

	});

}

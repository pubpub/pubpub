import React from 'react';
import Promise from 'bluebird';
import firebaseAdmin from 'firebase-admin';
import PubCollaboration from 'containers/PubCollaboration/PubCollaboration';
import Html from '../Html';
import app from '../server';
import analytics from '../analytics';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';
import { findPub } from '../queryHelpers';

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString());
firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(serviceAccount),
	databaseURL: process.env.FIREBASE_DATABASE_URL,
});

app.get('/pub/:slug/collaborate', (req, res, next)=> {
	if (!hostIsValid(req, 'community')) { return next(); }
	analytics(req);

	return getInitialData(req)
	.then((initialData)=> {
		return Promise.all([
			initialData,
			findPub(req, initialData)
		]);
	})
	.then(([initialData, pubData])=> {
		const tokenClientId = initialData.loginData.clientId || 'anonymous';
		const createFirebaseToken = firebaseAdmin.auth().createCustomToken(tokenClientId, {
			localPermissions: pubData.localPermissions,
			editorKey: `pub-${pubData.id}`,
		});
		return Promise.all([initialData, pubData, createFirebaseToken]);
	})
	.then(([initialData, pubData, firebaseToken])=> {
		const newInitialData = {
			...initialData,
			pubData: {
				...pubData,
				firebaseToken: firebaseToken,
				editorKey: `pub-${pubData.id}`,
			}
		};
		return renderToNodeStream(res,
			<Html
				chunkName="PubCollaboration"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `Collaborate · ${pubData.title}`,
					description: pubData.description,
					image: pubData.avatar,
					publishedAt: pubData.firstPublishedAt,
					unlisted: true,
				})}
			>
				<PubCollaboration {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});

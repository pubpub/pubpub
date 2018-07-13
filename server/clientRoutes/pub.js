import React from 'react';
import Promise from 'bluebird';
import firebaseAdmin from 'firebase-admin';
import Pub from 'containers/Pub/Pub';
import Html from '../Html';
import app from '../server';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';
import { findPub } from '../queryHelpers';

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString());
firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(serviceAccount),
	databaseURL: process.env.FIREBASE_DATABASE_URL,
});

app.get(['/pub/:slug', '/pub/:slug/content/:sectionId', '/pub/:slug/draft', '/pub/:slug/draft/content/:sectionId', '/pub/:slug/:mode', '/pub/:slug/:mode/:subMode'], (req, res, next)=> {
	if (!hostIsValid(req, 'community')) { return next(); }

	const isDraft = req.path.indexOf(`/pub/${req.params.slug}/draft`) === 0;
	const acceptedModes = ['collaborators', 'versions', 'invite', 'discussions', 'contents'];
	if (req.params.mode && acceptedModes.indexOf(req.params.mode) === -1) { return next(); }


	return getInitialData(req)
	.then((initialData)=> {
		return Promise.all([
			initialData,
			findPub(req, initialData, isDraft)
		]);
	})
	.then(([initialData, pubData])=> {
		/* If isDraft, generate a firebaseToken */
		const tokenClientId = initialData.loginData.clientId || 'anonymous';
		const createFirebaseToken = isDraft
			? firebaseAdmin.auth().createCustomToken(tokenClientId, {
				localPermissions: pubData.localPermissions,
				editorKey: `pub-${pubData.id}`,
			})
			: undefined;
		if (!isDraft && pubData && !pubData.versions.length) {
			throw new Error(`DraftRedirect:${req.params.slug}`);
		}
		return Promise.all([
			initialData,
			pubData,
			createFirebaseToken
		]);
	})
	.then(([initialData, pubData, firebaseToken])=> {
		/* A pub can be unlisted either because of the collections it is in */
		/* or because there is no privately visible content. For the second */
		/* case, this occurs when there are no visible saved versions and */
		/* the draft is private */
		const isUnlistedCollection = pubData.collections.reduce((prev, curr)=> {
			if (curr.isPublic) { return false; }
			return prev;
		}, true);
		const isUnlistedDraft = pubData.versions.length === 0 && pubData.collaborationMode === 'private';

		const newInitialData = {
			...initialData,
			pubData: {
				...pubData,
				isDraft: isDraft,
				firebaseToken: firebaseToken,
				editorKey: `pub-${pubData.id}`,
			}
		};
		return renderToNodeStream(res,
			<Html
				chunkName="Pub"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: pubData.title,
					description: pubData.description,
					image: pubData.avatar,
					collaborators: pubData.collaborators,
					publishedAt: pubData.firstPublishedAt,
					doi: pubData.doi,
					unlisted: isUnlistedCollection || isUnlistedDraft,
				})}
			>
				<Pub {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});

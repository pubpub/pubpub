import React from 'react';
import Promise from 'bluebird';
import PubNew from 'containers/PubNew/PubNew';
import Html from '../Html';
import app from '../server';
import {
	hostIsValid,
	renderToNodeStream,
	getInitialData,
	handleErrors,
	generateMetaComponents,
} from '../utilities';

import { getBranchDoc, getFirebaseToken } from '../utilitiesFirebaseAdmin';

app.get(
	['/pubnew', '/pubnew/:slug', '/pubnew/:slug/branch/:branchShortId', '/pubnew/:slug/:mode'],
	(req, res, next) => {
		if (!hostIsValid(req, 'community')) {
			return next();
		}

		/*
		get pubData from slug
			branches
			permissions

		*/

		const pubId = 'testpub';
		const branchId = 'testbranch';
		// const tokenClientId = initialData.loginData.clientId || 'anonymous';

		return Promise.all([
			getInitialData(req),
			getBranchDoc(pubId, branchId),
			getFirebaseToken('testid', {}),
		])
			.then(([initialData, branchData, firebaseToken]) => {
				const pubData = {};
				const newInitialData = {
					...initialData,
					pubData: {
						...pubData,
						content: branchData.content,
						initDocKey: branchData.mostRecentRemoteKey,
						firebaseRootKey: `pub-${pubId}`,
						firebaseToken: firebaseToken,
					},
				};
				return renderToNodeStream(
					res,
					<Html
						chunkName="PubNew"
						initialData={newInitialData}
						headerComponents={generateMetaComponents({
							initialData: initialData,
						})}
					>
						<PubNew {...newInitialData} />
					</Html>,
				);
			})
			.catch(handleErrors(req, res, next));
	},
);

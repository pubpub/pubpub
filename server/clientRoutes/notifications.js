import Promise from 'bluebird';
import React from 'react';
import Notifications from 'containers/Notifications/Notifications';
import Html from '../Html';
import app from '../server';
import analytics from '../analytics';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';
import { getNotifications } from '../notifications';

app.get('/notifications', (req, res, next)=> {
	if (!hostIsValid(req, 'community')) { return next(); }
	analytics(req);

	return getInitialData(req)
	.then((initialData)=> {
		if (!initialData.loginData.id) { throw new Error('User Not Found'); }

		return Promise.all([initialData, getNotifications(initialData.communityData.id, initialData.loginData.id, true, false)]);
	})
	.then(([initialData, notificationsData])=> {
		const newInitialData = {
			...initialData,
			notificationsData: notificationsData,
		};
		return renderToNodeStream(res,
			<Html
				chunkName="Notifications"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: newInitialData,
					title: 'Notifications · PubPub',
					unlisted: true
				})}
			>
				<Notifications {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});

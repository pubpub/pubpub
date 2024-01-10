import React from 'react';
import * as Sentry from '@sentry/react';
import { hydrate } from 'react-dom';
import { FocusStyleManager } from '@blueprintjs/core';

import { setEnvironment, setAppCommit } from 'utils/environment';

import { getClientInitialData } from './initialData';
import { setupHeap } from './heap';

const isStorybookEnv = (windowObj) =>
	windowObj.location.origin === 'http://localhost:9001' || windowObj.STORYBOOK_ENV === 'react';

const isLocalEnv = (windowObj) => windowObj.location.origin.indexOf('localhost:') > -1;

export const hydrateWrapper = (Component) => {
	if (typeof window !== 'undefined' && !isStorybookEnv(window)) {
		const initialData = getClientInitialData();
		const { isProd, isDuqDuq, isQubQub, appCommit } = initialData.locationData;
		setEnvironment(isProd, isDuqDuq, isQubQub);
		setAppCommit(appCommit);

		FocusStyleManager.onlyShowFocusOnTabs();

		/* Remove any leftover service workers from last PubPub instance */
		if (window.navigator && navigator.serviceWorker) {
			navigator.serviceWorker.getRegistrations().then((registrations) => {
				registrations.forEach((registration) => {
					registration.unregister();
				});
			});
		}

		// @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
		const viewData = JSON.parse(document.getElementById('view-data').getAttribute('data-json'));
		const chunkName = JSON.parse(
			// @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
			document.getElementById('chunk-name').getAttribute('data-json'),
		);
		if (!isLocalEnv(window)) {
			setupHeap(initialData);
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'sentryIsActive' does not exist on type '... Remove this comment to see the full error message
			window.sentryIsActive = true;
			Sentry.init({
				dsn: 'https://28b2ae6e574a49dfbc894d8793b36f0d@o31718.ingest.sentry.io/4504532925349888',
				environment: isProd ? 'prod' : 'dev',
				release: appCommit,
			});
			Sentry.setUser({
				id: initialData.loginData.id,
				username: initialData.loginData.slug,
			});
		}
		// const head = document.getElementsByTagName('head')[0];
		// console.log({ head });
		// const mainScript = window.document.createElement('script');

		// mainScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-9GK39XDD27');
		// mainScript.setAttribute('async', 'true');

		// head.insertAdjacentElement('afterend', mainScript);

		// const gtagScript = window.document.createElement('script');
		// gtagScript.innerText = `
		//   window.dataLayer = window.dataLayer || [];
		//   function gtag(){dataLayer.push(arguments);}
		//   gtag('js', new Date());

		//   gtag('config', 'G-9GK39XDD27');
		// 	`;

		// head.insertAdjacentElement('afterend', gtagScript);

		hydrate(
			<Component initialData={initialData} viewData={viewData} chunkName={chunkName} />,
			document.getElementById('root'),
		);
	}
};

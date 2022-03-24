/* eslint-disable */
import posthog from 'posthog-js';
import { isProd } from 'utils/environment';

import { getGdprConsentElection } from './legal/gdprConsent';

export const setupPosthog = (initialData) => {
	const { communityData, collectionData, pubData, loginData } = initialData;
	const hasGdprConsent = getGdprConsentElection(loginData);
	const posthogProjectId = isProd()
		? '422727431'
		: 'phc_Wb3dZyz5euH5Z61etqU6SKaxRW5DOhB7ia43O8Z3UK1';
	const customEventData = {
		communityId: null,
		pageId: null,
		pubId: null,
	};
	if (communityData) {
		customEventData.communityId = communityData.id;
	}
	if (collectionData) {
		customEventData.pageId = collectionData.id;
	}
	if (pubData) {
		customEventData.pubId = pubData.id;
	}
	posthog.init(posthogProjectId, {
		api_host: 'https://app.posthog.com',
		loaded: function (posthog) {
			if (hasGdprConsent && loginData.id) {
				posthog.identify(loginData.id);
				posthog.register({ ...customEventData });
			}
		},
	});
};

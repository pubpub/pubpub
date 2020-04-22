import { isProd } from './isProd';
import { getClientInitialData } from './initialData';
import { getGdprConsentElection } from './legal/gdprConsent';

export const setupHeap = () => {
	const { communityData, collectionData, pubData, loginData } = getClientInitialData();
	const hasGdprConsent = getGdprConsentElection(loginData);
	const heapEnvironment = isProd() ? '422727431' : '3777990325';
	window.heap.load(heapEnvironment);
	const customEventData = {
		communityId: null,
		pageId: null,
		pubId: null,
		branchId: null,
	};
	if (communityData) {
		customEventData.communityId = communityData.id;
	}
	if (collectionData) {
		customEventData.pageId = collectionData.id;
	}
	if (pubData) {
		customEventData.pubId = pubData.id;
		customEventData.branchId = pubData.activeBranch.id;
	}
	if (hasGdprConsent && loginData.id) {
		customEventData.loggedIn = 'true';
		window.heap.identify(loginData.id);
	}
	window.heap.addEventProperties(customEventData);
};

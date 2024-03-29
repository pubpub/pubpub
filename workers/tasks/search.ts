import algoliasearch from 'algoliasearch';
import { Community, PubAttribution } from '../../server/models';
import { getPubSearchData, getPageSearchData } from '../utils/searchUtils';

// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
const client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_KEY);
const pubsIndex = client.initIndex('pubs');
const pagesIndex = client.initIndex('pages');

export const deletePageSearchData = (pageId) => {
	return pagesIndex
		.deleteBy({
			filters: `pageId:${pageId}`,
		})
		.catch((err) => {
			console.error('Error deleting Page search data: ', err);
		});
};

export const setPageSearchData = (pageId) => {
	return deletePageSearchData(pageId)
		.then(() => {
			return getPageSearchData([pageId]);
		})
		.then((pageSyncData) => {
			return pagesIndex.saveObjects(pageSyncData, { autoGenerateObjectIDIfNotExist: true });
		})
		.catch((err) => {
			console.error('Error setting Page search data: ', err);
		});
};

export const deletePubSearchData = (pubId) => {
	return pubsIndex
		.deleteBy({
			filters: `pubId:${pubId}`,
		})
		.catch((err) => {
			console.error('Error deleting Pub search data: ', err);
		});
};

export const setPubSearchData = (pubId) => {
	return deletePubSearchData(pubId)
		.then(() => {
			return getPubSearchData([pubId]);
		})
		.then((pubSyncData) => {
			return pubsIndex.saveObjects(pubSyncData, { autoGenerateObjectIDIfNotExist: true });
		})
		.catch((err) => {
			console.error('Error setting Pub search data: ', err);
		});
};

export const updateCommunityData = (communityId) => {
	const getObjectIds = async (index) => {
		let hits = [];
		await index.browseObjects({
			filters: `communityId:${communityId}`,
			attributesToRetrieve: ['objectId'],
			batch: (batch) => {
				hits = hits.concat(batch);
			},
		});
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'objectID' does not exist on type 'never'... Remove this comment to see the full error message
		return hits.map((hit) => hit.objectID);
	};

	const findCommunityData = Community.findOne({
		where: {
			id: communityId,
		},
	});

	return Promise.all([getObjectIds(pubsIndex), getObjectIds(pagesIndex), findCommunityData])
		.then(([pubObjectIds, pageObjectIds, communityData]) => {
			if (!communityData) {
				return null;
			}
			const updatedCommunityData = {
				communityId: communityData.id,
				communityDomain: communityData.domain || `${communityData.subdomain}.pubpub.org`,
				communityAvatar: communityData.avatar,
				communityTitle: communityData.title,
				// @ts-expect-error FIXME: Property 'accentColor' does not exist on type 'Community'.
				communityColor: communityData.accentColor,
				communityTextColor: communityData.accentTextColor,
			};
			const pubObjects = pubObjectIds.map((objectId) => {
				return { objectID: objectId, ...updatedCommunityData };
			});
			const pageObjects = pageObjectIds.map((objectId) => {
				return { objectID: objectId, ...updatedCommunityData };
			});

			const updatePubSearchRecords = pubsIndex.partialUpdateObjects(pubObjects);
			const updatePageSearchRecords = pagesIndex.partialUpdateObjects(pageObjects);
			return Promise.all([updatePubSearchRecords, updatePageSearchRecords]);
		})
		.catch((err) => {
			console.error('Error updating community search data: ', err);
		});
};

export const updateUserData = (userId) => {
	return PubAttribution.findAll({
		where: {
			isAuthor: true,
			userId,
		},
		attributes: ['id', 'isAuthor', 'userId', 'pubId'],
	})
		.then((attributionsData) => {
			if (!attributionsData.length) {
				return null;
			}

			const pubIds = attributionsData.map((pubAttribution) => {
				return pubAttribution.pubId;
			});
			const updateFunctions = pubIds.map((pubId) => {
				return setPubSearchData(pubId);
			});
			return Promise.all(updateFunctions);
		})
		.catch((err) => {
			console.error('Error updating user search data: ', err);
		});
};

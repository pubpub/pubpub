import { nestDiscussionsToThreads } from 'utilities';

export const getActiveDiscussionChannel = (pubData, locationData) => {
	return pubData.discussionChannels.reduce((prev, curr) => {
		if (locationData.query.channel === curr.title) {
			return curr;
		}
		return prev;
	}, undefined);
};

export const getThreads = (pubData, locationData) => {
	const discussions = pubData.discussions || [];
	const activeDiscussionChannel = getActiveDiscussionChannel(pubData, locationData);
	const threads = nestDiscussionsToThreads(discussions).filter((thread) => {
		const activeDiscussionChannelId = activeDiscussionChannel
			? activeDiscussionChannel.id
			: null;
		return activeDiscussionChannelId === thread[0].discussionChannelId;
	});
	return threads;
};

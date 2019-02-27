const nestDiscussionsToThreads = (discussions) => {
	const maxThreadNumber = discussions.reduce((prev, curr) => {
		if (curr.threadNumber > prev) {
			return curr.threadNumber;
		}
		return prev;
	}, 0);

	const tempThreads = new Array(maxThreadNumber).fill([]);
	discussions.forEach((item) => {
		tempThreads[item.threadNumber - 1] = [...tempThreads[item.threadNumber - 1], item];
	});

	return tempThreads
		.filter((thread) => {
			return thread.length;
		})
		.map((thread) => {
			return thread.sort((foo, bar) => {
				if (foo.createdAt > bar.createdAt) {
					return 1;
				}
				if (foo.createdAt < bar.createdAt) {
					return -1;
				}
				return 0;
			});
		});
};

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

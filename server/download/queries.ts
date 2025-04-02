import { Community, Download, WorkerTask } from 'server/models';
import { addWorkerTask } from 'server/utils/workers';
import { expect } from 'utils/assert';
import { communityUrl } from 'utils/canonicalUrls';

const getCommunityFastlyCacheAge = async (communityId: string) => {
	const community = expect(await Community.findByPk(communityId));
	const communityLandingPageURL = communityUrl(community);
	const headers = await fetch(communityLandingPageURL).then((x) => x.headers);
	return Number(expect(headers.get('age')));
};

export const getOrStartDownloadTask = async ({ communityId }: { communityId: string }) => {
	const download = await Download.findOne({
		where: {
			communityId,
		},
		include: [{ model: WorkerTask, as: 'workerTask' }],
	});

	if (download?.workerTask && download.workerTask.error === null) {
		return { taskId: download.workerTask.id };
	}

	const now = Date.now();
	const cacheAge = await getCommunityFastlyCacheAge(communityId);
	const cacheWasPurged =
		download === null || new Date(download.timestamp).getTime() - now > cacheAge;

	if (cacheWasPurged) {
		const task = await addWorkerTask({
			type: 'download',
			input: {
				communityId,
			},
		});
		await Download.upsert({
			communityId,
			timestamp: new Date(now).toString(),
			workerTaskId: task.id,
		});
		return { taskId: task.id };
	}

	return { url: download.url };
};

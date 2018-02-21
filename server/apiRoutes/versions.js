import app from '../server';
import { Pub, Version, Collaborator, CommunityAdmin, Discussion, Collection } from '../models';
import { generateNewVersionNotification } from '../notifications';
import { submitDoiData } from '../utilities';

app.post('/api/versions', (req, res)=> {
	const user = req.user || {};
	const findCollaborator = Collaborator.findOne({
		where: {
			userId: user.id,
			pubId: req.body.pubId,
		}
	});
	const findCommunityAdmin = CommunityAdmin.findOne({
		where: {
			userId: req.user && req.user.id,
			communityId: req.body.communityId || null,
		}
	});
	const findPub = Pub.findOne({
		where: { id: req.body.pubId, communityId: req.body.communityId },
		include: [{
			model: Collection,
			as: 'collections',
			attributes: ['id', 'isOpenPublish'],
			through: { attributes: [] },
		}]
	});
	const findSubmitDiscussion = Discussion.findOne({
		where: {
			submitHash: req.body.submitHash,
			pubId: req.body.pubId,
			communityId: req.body.communityId || null,
			isArchived: { $not: true },
		}
	});
	const currentTimestamp = new Date();
	let firstPublishedAtValue;

	Promise.all([findCollaborator, findCommunityAdmin, findPub, findSubmitDiscussion])
	.then(([collaboratorData, communityAdminData, pubData, discussionData])=> {
		const isManager = collaboratorData && collaboratorData.permissions === 'manage';
		const accessAsCommunityAdmin = communityAdminData && (pubData.adminPermissions === 'manage' || isManager);
		const canApproveSubmission = communityAdminData && discussionData;
		const canOpenPublish = isManager && pubData.collections.reduce((prev, curr)=> {
			if (prev && curr.isOpenPublish) { return prev; }
			return false;
		}, true);
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859'
			&& !canOpenPublish
			&& !accessAsCommunityAdmin
			&& !canApproveSubmission
		) {
			throw new Error('Not Authorized to update this pub');
		}
		firstPublishedAtValue = pubData.firstPublishedAt;
		return Version.create({
			pubId: req.body.pubId,
			content: req.body.content,
		});
	})
	.then(()=> {
		const updatePub = Pub.update({
			firstPublishedAt: firstPublishedAtValue || currentTimestamp,
			lastPublishedAt: currentTimestamp,
		}, {
			where: { id: req.body.pubId }
		});
		const generateNotification = generateNewVersionNotification(
			req.body.pubId,
			req.body.communityId,
			user.id,
			!firstPublishedAtValue
		);
		return Promise.all([updatePub, generateNotification]);
	})
	.then(()=> {
		const updateDiscussion = Discussion.update({ isArchived: true, submitApprovedAt: currentTimestamp }, {
			where: {
				submitHash: req.body.submitHash,
				pubId: req.body.pubId,
				communityId: req.body.communityId || null,
				isArchived: { $not: true },
			}
		});
		const updateDoiData = submitDoiData(req.body.pubId, req.body.communityId, false);
		return Promise.all([updateDiscussion, updateDoiData]);
	})
	.then(()=> {
		return res.status(201).json('Version Published Successfully');
	})
	.catch((err)=> {
		console.error('Error in postVersion: ', err);
		return res.status(500).json(err.message);
	});
});

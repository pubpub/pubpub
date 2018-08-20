import app from '../server';
import { PubManager, User, CommunityAdmin, PubAttribution, DiscussionChannel, DiscussionChannelParticipant } from '../models';
import { generateHash } from '../utilities';

app.post('/api/discussionChannels', (req, res)=> {
	// Anyone can create discussion channel.
	// Only managers can set discussion channels public?
	// discussionChannels have participants, some of whom are moderators


	const user = req.user || {};

	const findCommunityAdmin = CommunityAdmin.findOne({
		where: {
			communityId: req.body.communityId,
			userId: user.id,
		}
	});
	const findPubManager = PubManager.findOne({
		where: {
			pubId: req.body.pubId,
			userId: user.id
		},
	});
	Promise.all([findCommunityAdmin, findPubManager])
	.then(([communityAdminData, pubManagerData])=> {
		// if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859' && !communityAdminData && !pubManagerData) {
		// 	throw new Error('Not Authorized to edit this pub');
		// }
		return DiscussionChannel.create({
			title: req.body.title.replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/gi, '').toLowerCase(),
			isPublicRead: false,
			isPublicWrite: false,
			isCommunityAdminModerated: true,
			pubId: req.body.pubId,
			communityId: req.body.communityId,
			viewHash: generateHash(8),
			writeHash: generateHash(8),
		});
	})
	.then((newDiscussionChannel)=> {
		return DiscussionChannelParticipant.create({
			isModerator: true,
			userId: user.id,
			discussionChannelId: newDiscussionChannel.id,
		});
	})
	.then((newDiscussionChannelParticipant)=> {
		return DiscussionChannel.findOne({
			where: {
				id: newDiscussionChannelParticipant.discussionChannelId
			},
			include: [
				{
					model: DiscussionChannelParticipant,
					as: 'participants',
					include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'avatar', 'slug', 'initials', 'title'] }]
				}
			]
		});
	})
	.then((newDiscussionChannelData)=> {
		return res.status(201).json(newDiscussionChannelData);
	})
	.catch((err)=> {
		console.error('Error in POST discussionChannel: ', err);
		return res.status(500).json(err.message);
	});
});

app.put('/api/discussionChannels', (req, res)=> {
	const user = req.user || {};

	// Filter to only allow certain fields to be updated
	const updatedPubAttribution = {};
	Object.keys(req.body).forEach((key)=> {
		if (['name', 'avatar', 'title', 'order', 'isAuthor', 'roles'].indexOf(key) > -1) {
			updatedPubAttribution[key] = req.body[key];
		}
	});

	const findCommunityAdmin = CommunityAdmin.findOne({
		where: {
			communityId: req.body.communityId,
			userId: user.id,
		}
	});
	const findPubManager = PubManager.findOne({
		where: {
			pubId: req.body.pubId,
			userId: user.id
		},
	});
	Promise.all([findCommunityAdmin, findPubManager])
	.then(([communityAdminData, pubManagerData])=> {
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859' && !communityAdminData && !pubManagerData) {
			throw new Error('Not Authorized to edit this pub');
		}
		return PubAttribution.update(updatedPubAttribution, {
			where: { id: req.body.pubAttributionId },
		});
	})
	.then(()=> {
		return res.status(201).json(updatedPubAttribution);
	})
	.catch((err)=> {
		console.error('Error in putPubAttribution: ', err);
		return res.status(500).json(err.message);
	});
});

app.delete('/api/discussionChannels', (req, res)=> {
	const user = req.user || {};

	const findCommunityAdmin = CommunityAdmin.findOne({
		where: {
			communityId: req.body.communityId,
			userId: user.id,
		}
	});
	const findPubManager = PubManager.findOne({
		where: {
			pubId: req.body.pubId,
			userId: user.id
		},
	});
	Promise.all([findCommunityAdmin, findPubManager])
	.then(([communityAdminData, pubManagerData])=> {
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859' && !communityAdminData && !pubManagerData) {
			throw new Error('Not Authorized to edit this pub');
		}
		return PubAttribution.destroy({
			where: { id: req.body.pubAttributionId },
		});
	})
	.then(()=> {
		return res.status(201).json(req.body.pubAttributionId);
	})
	.catch((err)=> {
		console.error('Error in deletePubAttribution: ', err);
		return res.status(500).json(err.message);
	});
});

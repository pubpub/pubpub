import stream from 'getstream';
import { Pub, User, Discussion, Collaborator, CommunityAdmin } from './models';

const client = stream.connect(process.env.STREAM_API_KEY, process.env.STREAM_API_KEY_SECRET);

/*
{% if verb.infinitive == 'submitted' %}
{{ verb.id }}{{ object }}{{ time.strftime('%Y-%m-%d') }}
{% elif verb.infinitive == 'created' %}
{{ verb.id }}{{ object }}{{ time.strftime('%Y-%m-%d') }}
{% elif verb.infinitive == 'published' %}
{{ verb.id }}{{ object }}{{ isFirstPublish }}{{ time.strftime('%Y-%m-%d') }}
{% elif verb.infinitive == 'discussed' %}
{{ verb.id }}{{ target }}{{ time.strftime('%Y-%m-%d') }}
{% elif verb.infinitive == 'added' %}
{{ verb.id }}{{ object }}{{ time.strftime('%Y-%m-%d') }}
{% elif verb.infinitive == 'replied' %}
{{ verb.id }}{{ object }}{{ time.strftime('%Y-%m-%d') }}
{% else %}
{{ actor }}{{ verb.id }}{{ object }}{{ time.strftime('%Y-%m-%d') }}
{% endif %}
*/

export const addActivity = ({ communityId, feedIds, activityType, actor, object, target, isFirstPublish })=> {
	const activityTypes = {
		newSubmission: {
			/* Sent to all Community Admins */
			actor: `User:${actor}`,
			verb: 'submitted',
			object: `Pub:${object}`,
		},
		newPub: {
			/* Sent to all Community Admins */
			actor: `User:${actor}`,
			verb: 'created',
			object: `Pub:${object}`,
		},
		newVersionPublished: {
			/* Sent to all contributors and community admins who are not the actor */
			actor: `User:${actor}`,
			verb: 'published',
			object: `Pub:${object}`,
			isFirstPublish: isFirstPublish,
		},
		newDiscussion: {
			/* Sent to all contributors and community admins who are not the actor */
			actor: `User:${actor}`,
			verb: 'discussed',
			object: `Discussion:${object}`,
			target: `Pub:${target}`,
		},
		newCollaborator: {
			/* Sent to actor */
			actor: `User:${actor}`,
			verb: 'added',
			object: `Pub:${object}`,
		},
		discussionReply: {
			/* Sent to all authors in thread who are not the actor */
			actor: `User:${actor}`,
			verb: 'replied',
			object: `Discussion:${object}`,
			target: `Pub:${target}`,
		},

	};
	if (feedIds.length === 0) { return null; }
	const feeds = feedIds.map((id)=> {
		return `notifications:${communityId}_${id}`;
	});
	const activity = activityTypes[activityType];
	return client.addToMany(activity, feeds)
	.then((result)=> {
		return result;
	})
	.catch((err)=> {
		console.log('err', err);
	});
};

export const getNotificationsCount = (communityId, userId)=> {
	/* We use unseen for whether it has been emailed or not */
	/* We use unread for whether the user viewed it in the site */
	const userFeed = client.feed('notifications', `${communityId}_${userId}`);
	return userFeed.get({ limit: 1 })
	.then((activityData)=> {
		return activityData.unread;
	});
};

export const getNotifications = (communityId, userId, markRead, markSeen)=> {
	/* We use unseen for whether it has been emailed or not */
	/* We use unread for whether the user viewed it in the site */
	const userFeed = client.feed('notifications', `${communityId}_${userId}`);
	return userFeed.get({ limit: 100, mark_read: markRead, mark_seen: markSeen })
	.then((activityData)=> {
		const pubIds = new Set();
		const userIds = new Set();
		const discussionIds = new Set();
		activityData.results.forEach((result)=> {
			result.activities.forEach((activity)=> {
				Object.values(activity).filter((value)=> {
					return typeof value === 'string';
				}).forEach((value)=> {
					if (value.indexOf('Pub:') === 0) { pubIds.add(value.replace('Pub:', '')); }
					if (value.indexOf('Discussion:') === 0) { discussionIds.add(value.replace('Discussion:', '')); }
					if (value.indexOf('User:') === 0) { userIds.add(value.replace('User:', '')); }
				});
			});
		});
		return Promise.all([
			activityData,
			Pub.findAll({ where: { id: [...pubIds] }, attributes: ['id', 'slug', 'title', 'avatar'] }),
			User.findAll({ where: { id: [...userIds] }, attributes: ['id', 'slug', 'fullName', 'avatar'] }),
			Discussion.findAll({ where: { id: [...discussionIds] }, attributes: ['id', 'threadNumber', 'title'] }),
		]);
	})
	.then(([activityData, pubData, userData, discussionData])=> {
		const dataById = {};
		pubData.forEach((pub)=> { dataById[pub.id] = pub; });
		discussionData.forEach((discussion)=> { dataById[discussion.id] = discussion; });
		userData.forEach((user)=> { dataById[user.id] = user; });

		const enrichedActivityData = {
			...activityData,
			results: activityData.results.map((result)=> {
				return {
					...result,
					activities: result.activities.map((activity)=> {
						const newActivity = { ...activity };
						Object.keys(activity).filter((key)=> {
							const value = activity[key];
							return typeof value === 'string' && dataById[value.split(':')[1]];
						}).forEach((key)=> {
							const value = activity[key];
							newActivity[key] = dataById[value.split(':')[1]];
						});
						return newActivity;
					}).filter((activity)=> {
						const hasActor = typeof activity.actor !== 'string';
						const hasObject = typeof activity.object !== 'string';
						return hasActor && hasObject;
					})
				};
			}).filter((result)=> {
				return result.activities && result.activities.length;
			})
		};
		return enrichedActivityData;
	})
	.catch((err)=> {
		console.log('err', err);
	});
};

export const generateNewSubmissionNotification = (discussionData)=> {
	/* Notify all community admins */
	const activityFeedUserQuery = CommunityAdmin.findAll({
		where: { communityId: discussionData.communityId },
		attributes: ['userId'],
	});

	return activityFeedUserQuery
	.then((activityFeedUserData)=> {
		return addActivity({
			communityId: discussionData.communityId,
			feedIds: activityFeedUserData.map((item)=> { return item.userId; }),
			activityType: 'newSubmission',
			actor: discussionData.userId,
			object: discussionData.pubId,
		});
	});
};

export const generateDiscussionReplyNotification = (discussionData)=> {
	/* Notify everyone in the thread */
	const activityFeedUserQuery = Discussion.findAll({
		where: { pubId: discussionData.pubId, threadNumber: discussionData.threadNumber, userId: { $ne: discussionData.userId } },
		attributes: ['userId'],
	});

	return activityFeedUserQuery
	.then((activityFeedUserData)=> {
		return addActivity({
			communityId: discussionData.communityId,
			feedIds: [...new Set(activityFeedUserData.map((item)=> { return item.userId; }))],
			activityType: 'discussionReply',
			actor: discussionData.userId,
			object: discussionData.id,
			target: discussionData.pubId,
		});
	});
};

export const generateNewDiscussionNotification = (discussionData)=> {
	/* Notify all community admins and collaborators */
	const activityFeedAdminQuery = CommunityAdmin.findAll({
		where: { communityId: discussionData.communityId, userId: { $ne: discussionData.userId } },
		attributes: ['userId'],
	});
	const activityFeedCollaboratorQuery = Collaborator.findAll({
		where: { pubId: discussionData.pubId, userId: { $ne: discussionData.userId } },
		attributes: ['userId'],
	});

	return Promise.all([activityFeedAdminQuery, activityFeedCollaboratorQuery])
	.then(([activityFeedAdminData, activityFeedCollaboratorData])=> {
		return addActivity({
			communityId: discussionData.communityId,
			feedIds: [...new Set([...activityFeedAdminData, ...activityFeedCollaboratorData].map((item)=> { return item.userId; }))],
			activityType: 'newDiscussion',
			actor: discussionData.userId,
			object: discussionData.id,
			target: discussionData.pubId,
		});
	});
};

export const generatePubCreateNotification = (newPub, userId)=> {
	const activityType = 'newPub';

	const activityFeedUserQuery = CommunityAdmin.findAll({
		where: { communityId: newPub.communityId, userId: { $ne: userId } },
		attributes: ['userId'],
	});

	return activityFeedUserQuery
	.then((activityFeedUserData)=> {
		return addActivity({
			communityId: newPub.communityId,
			feedIds: activityFeedUserData.map((item)=> { return item.userId; }),
			activityType: activityType,
			actor: userId,
			object: newPub.id,
		});
	});
};

export const generateNewVersionNotification = (pubId, communityId, userId, isFirstPublish)=> {
	const activityType = 'newVersionPublished';

	const activityFeedAdminQuery = CommunityAdmin.findAll({
		where: { communityId: communityId, userId: { $ne: userId } },
		attributes: ['userId'],
	});
	const activityFeedCollaboratorQuery = Collaborator.findAll({
		where: { pubId: pubId, userId: { $ne: userId } },
		attributes: ['userId'],
	});

	return Promise.all([activityFeedAdminQuery, activityFeedCollaboratorQuery])
	.then(([activityFeedAdminData, activityFeedCollaboratorData])=> {
		const feedIds = [...new Set([...activityFeedAdminData, ...activityFeedCollaboratorData].map((item)=> { return item.userId; }))];
		return addActivity({
			communityId: communityId,
			feedIds: feedIds,
			activityType: activityType,
			actor: userId,
			object: pubId,
			isFirstPublish: isFirstPublish,
		});
	});
};

export const generateNewCollaboratorNotification = (pubId, communityId, userId)=> {
	const activityType = 'newCollaborator';
	return addActivity({
		communityId: communityId,
		feedIds: [userId],
		activityType: activityType,
		actor: userId,
		object: pubId,
	});
};

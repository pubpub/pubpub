import {
	Collection,
	CollectionAttribution,
	Community,
	Pub,
	PubAttribution,
	Version,
	User,
} from '../../models';
import submission from '../../../shared/crossref/submission';

const findPub = (pubId, communityId) =>
	Pub.findOne({
		where: { id: pubId, communityId: communityId },
		include: [
			{ model: Version, as: 'versions', where: { isPublic: true } },
			// { model: User, as: 'collaborators' },
			// { model: Collaborator, as: 'emptyCollaborators', where: { userId: null }, required: false }
			{
				model: PubAttribution,
				as: 'attributions',
				required: false,
				include: [
					{
						model: User,
						as: 'user',
						required: false,
						attributes: [
							'id',
							'firstName',
							'lastName',
							'fullName',
							'avatar',
							'slug',
							'initials',
							'title',
						],
					},
				],
			},
		],
	});

const findCommunity = (communityId) =>
	Community.findOne({
		where: { id: communityId },
		attributes: ['id', 'title', 'issn', 'domain', 'subdomain'],
	});

const findCollection = (collectionId) =>
	Collection.findOne({
		where: { id: collectionId },
		include: [
			{
				model: CollectionAttribution,
				as: 'attributions',
				include: [
					{
						model: User,
						as: 'user',
						required: false,
						attributes: [
							'id',
							'firstName',
							'lastName',
							'fullName',
							'avatar',
							'slug',
							'initials',
							'title',
						],
					},
				],
			},
		],
	});

export const getDoiData = ({ communityId, collectionId, pubId }) => {
	Promise.all([
		findPub(pubId, communityId),
		findCommunity(communityId),
		collectionId && findCollection(collectionId),
	]).then(([pub, community, collection]) => {
		return submission({ community: community, collection: collection, pub: pub });
	});
};

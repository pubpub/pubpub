import { Readable } from 'stream';
import request from 'request-promise';
import xmlbuilder from 'xmlbuilder';

import deposit from 'shared/crossref/deposit';
import {
	Collection,
	CollectionAttribution,
	Community,
	Pub,
	PubAttribution,
	Version,
	User,
} from '../../models';

const findPub = (pubId) =>
	Pub.findOne({
		where: { id: pubId },
		include: [
			// STOPSHIP(ian): include only public versions here
			{ model: Version, as: 'versions' },
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

const submitDoiData = (json, timestamp) => {
	const { DOI_SUBMISSION_URL, DOI_LOGIN_ID, DOI_LOGIN_PASSWORD } = process.env;
	const xmlObject = xmlbuilder.create(json, { headless: true }).end({ pretty: true });
	const readStream = new Readable();
	// eslint-disable-next-line no-underscore-dangle
	readStream._read = function noop() {};
	readStream.push(xmlObject);
	readStream.push(null);
	readStream.path = `/${timestamp}.xml`;
	return request({
		method: 'POST',
		url: DOI_SUBMISSION_URL,
		formData: {
			login_id: DOI_LOGIN_ID,
			login_passwd: DOI_LOGIN_PASSWORD,
			fname: readStream,
		},
		headers: {
			'content-type': 'multipart/form-data',
			'user-agent': 'PubPub (mailto:team@pubpub.org)',
		},
	});
};

const persistDoiData = (ids, dois) => {
	const { collectionId, pubId } = ids;
	const { collectionDoi, pubDoi } = dois;
	const updates = [];
	if (collectionId && collectionDoi) {
		updates.push(Collection.update({ doi: collectionDoi }, { where: { id: collectionId } }));
	}
	if (pubId && pubDoi) {
		updates.push(Pub.update({ doi: pubDoi }, { where: { id: pubId } }));
	}
	return Promise.all(updates);
};

export const getDoiData = ({ communityId, collectionId, pubId }) =>
	Promise.all([
		pubId && findPub(pubId),
		findCommunity(communityId),
		collectionId && findCollection(collectionId),
	]).then(([pub, community, collection]) =>
		deposit({ community: community, collection: collection, pub: pub }),
	);

export const setDoiData = ({ communityId, collectionId, pubId }) =>
	getDoiData({ communityId: communityId, collectionId: collectionId, pubId: pubId }).then(
		({ json, timestamp, dois }) =>
			submitDoiData(json, timestamp)
				.then(() => persistDoiData({ collectionId: collectionId, pubId: pubId }, dois))
				.then(() => {
					return { json: json, dois: dois };
				}),
	);

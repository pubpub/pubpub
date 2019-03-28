import { Readable } from 'stream';
import request from 'request-promise';
import xmlbuilder from 'xmlbuilder';

import submission from 'shared/crossref/submission';
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
	console.log(xmlObject);
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
		},
	});
};

export const getDoiData = ({ communityId, collectionId, pubId }, issueOptions) =>
	Promise.all([
		pubId && findPub(pubId),
		findCommunity(communityId),
		collectionId && findCollection(collectionId),
	]).then(([pub, community, collection]) =>
		submission({ community: community, collection: collection, pub: pub }, issueOptions),
	);

export const setDoiData = (context, issueOptions) =>
	getDoiData(context, issueOptions).then(({ json, timestamp }) =>
		submitDoiData(json, timestamp).then((...args) => {
			return json;
		}),
	);

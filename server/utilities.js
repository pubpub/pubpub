import queryString from 'query-string';
import { Community, Collection, User } from './models';

export const getInitialData = (req)=> {
	const hostname = req.get('host').indexOf('localhost') > -1 || req.get('host').indexOf('ssl.pubpub.org') > -1
		? 'joi.pubpub.org'
		: req.get('host');
	const whereQuery = hostname.indexOf('.pubpub.org')
		? { subdomain: hostname.replace('.pubpub.org', '') }
		: { domain: hostname };

	console.time('query');
	return Community.findOne({
		where: whereQuery,
		attributes: {
			exclude: ['createdAt', 'updatedAt']
		},
		include: [
			{
				model: Collection,
				as: 'collections',
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'communityId']
				},
			},
			{
				model: User,
				as: 'admins',
				through: { attributes: [] },
				attributes: ['id', 'slug', 'fullName', 'initials', 'avatar'],
			}
		],
	})
	.then((communityResult)=> {
		console.timeEnd('query');
		console.time('process');
		const communityData = communityResult && communityResult.toJSON();
		const user = req.user || {};

		const loginData = {
			id: user.id,
			initials: user.initials,
			slug: user.slug,
			fullName: user.fullName,
			avatar: user.avatar,
			isAdmin: communityData && communityData.admins.reduce((prev, curr)=> {
				if (curr.id === user.id) { return true; }
				return prev;
			}, false)
		};

		const locationData = {
			host: req.get('host'),
			path: req.get('path'),
			query: req.get('query'),
			queryString: queryString.stringify(req.get('query')),
		};

		if (communityData) {
			communityData.collections = communityData.collections.filter((item)=> {
				return loginData.isAdmin || item.isPublic;
			});
		}
		console.timeEnd('process');
		return {
			communityData: communityData,
			loginData: loginData,
			locationData: locationData,
		};
	});
};

export const getCommunity = (req)=> {
	const hostname = req.get('host').indexOf('localhost') > -1 || req.get('host').indexOf('ssl.pubpub.org') > -1
		? 'joi.pubpub.org'
		: req.get('host');

	return Community.findOne({
		where: {
			$or: [
				{ subdomain: hostname.replace('.pubpub.org', '') },
				{ domain: hostname }
			]
		},
		include: [
			{
				model: Collection,
				as: 'collections',
			},
			{
				model: User,
				as: 'admins',
				through: { attributes: [] },
				attributes: ['id', 'slug', 'fullName', 'initials', 'avatar'],
			}
		],
	});
};

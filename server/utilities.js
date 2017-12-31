import React from 'react';
import { resolve } from 'path';
import queryString from 'query-string';
import { Community, Collection, User } from './models';

export const getInitialData = (req)=> {
	const hostname = req.hostname.indexOf('localhost') > -1 || req.hostname.indexOf('ssl.pubpub.org') > -1
		? 'joi.pubpub.org'
		: req.hostname;
	const whereQuery = hostname.indexOf('.pubpub.org')
		? { subdomain: hostname.replace('.pubpub.org', '') }
		: { domain: hostname };

	/* Gather user data */
	const user = req.user || {};
	const loginData = {
		id: user.id,
		initials: user.initials,
		slug: user.slug,
		fullName: user.fullName,
		avatar: user.avatar,
	};

	/* Gather location data */
	const locationData = {
		hostname: req.hostname,
		path: req.path,
		params: req.params,
		query: req.query,
		queryString: queryString.stringify(req.query),
		isBasePubPub: hostname === 'www.pubpub.org' || hostname === 'v4.pubpub.org',

	};

	/* If basePubPub - return fixed data */
	if (locationData.isBasePubPub) {
		return new Promise((resolvePromise)=> {
			resolvePromise({
				communityData: {
					title: 'PubPub',
					description: 'Collaborative Community Publishing',
					favicon: '/favicon.png',
					accentColor: '#112233',
					accentTextColor: '#FFFFFF',
					accentActionColor: 'rgba(17, 34, 51, 0.6)',
					accentHoverColor: 'rgba(17, 34, 51, 0.8)',
					accentMinimalColor: 'rgba(17, 34, 51, 0.2)',
				},
				loginData: loginData,
				locationData: locationData,
			});
		});
	}

	/* If we have a community to find, search, and then return */
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
		if (!communityResult) { throw new Error('Community Not Found'); }

		const communityData = communityResult.toJSON();
		communityData.collections = communityData.collections.filter((item)=> {
			return loginData.isAdmin || item.isPublic;
		});

		loginData.isAdmin = communityData.admins.reduce((prev, curr)=> {
			if (curr.id === user.id) { return true; }
			return prev;
		}, false);

		return {
			communityData: communityData,
			loginData: loginData,
			locationData: locationData,
		};
	});
};

export const generateMetaComponents = ({ initialData, title, description, image, publishedAt, unlisted })=> {
	const siteName = initialData.communityData.title;
	const url = `https://${initialData.locationData.hostname}${initialData.locationData.path}`;
	const favicon = initialData.communityData.favicon;

	let outputComponents = [];

	if (title) {
		outputComponents = [
			...outputComponents,
			<title key="t1">{title}</title>,
			<meta key="t2" property="og:title" content={title} />,
			<meta key="t3" name="twitter:title" content={title} />,
			<meta name="twitter:image:alt" content={title} />
		];
	}

	if (siteName) {
		outputComponents = [
			...outputComponents,
			<meta key="sn1" property="og:site_name" content={siteName} />,
		];
	}

	if (url) {
		outputComponents = [
			...outputComponents,
			<meta key="u1" property="og:url" content={url} />,
			<meta key="u2" property="og:type" content={url.indexOf('/pub/') > -1 ? 'article' : 'website'} />,
		];
	}

	if (description) {
		outputComponents = [
			...outputComponents,
			<meta key="d1" name="description" content={description} />,
			<meta key="d2" property="og:description" content={description} />,
			<meta key="d3" name="twitter:description" content={description} />,
		];
	}

	if (image) {
		outputComponents = [
			...outputComponents,
			<meta key="i1" property="og:image" content={image} />,
			<meta key="i2" property="og:image:url" content={image} />,
			<meta key="i3" property="og:image:width" content="500" />,
			<meta name="twitter:image" content={image} />
		];
	}

	if (favicon) {
		outputComponents = [
			...outputComponents,
			<link key="f1" rel="icon" type="image/png" sizes="256x256" href={favicon} />,
		];
	}

	if (publishedAt) {
		outputComponents = [
			...outputComponents,
			<meta key="pa1" property="article:published_time" content={publishedAt} />
		];
	}

	if (unlisted) {
		outputComponents = [
			...outputComponents,
			<meta key="un1" name="robots" content="noindex,nofollow" />
		];
	}

	outputComponents = [
		...outputComponents,
		<meta key="misc1" property="fb:app_id" content="924988584221879" />,
		<meta key="misc2" name="twitter:card" content="summary" />,
		<meta key="misc3" name="twitter:site" content="@pubpub" />,
	];

	return outputComponents;
};

export const handleErrors = (req, res, next)=> {
	return (err) => {
		if (err.message === 'Community Not Found') {
			return res.status(404).sendFile(resolve(__dirname, './errorPages/communityNotFound.html'));
		}
		if (err.message === 'Collection Not Found' ||
			err.message === 'Pub Not Found'
		) {
			return next();
		}
		console.log('Err', err);
		return res.status(500).json('Error');
	};
};

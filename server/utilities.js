import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { resolve } from 'path';
import queryString from 'query-string';
import Cite from 'citation-js';
import { Community, Collection, User } from './models';
import { getNotificationsCount } from './notifications';

export const hostIsValid = (req, access)=> {
	const isBasePubPub = req.hostname === 'www.pubpub.org';
	if (!isBasePubPub && access !== 'community') { return false; }
	if (isBasePubPub && access !== 'pubpub') { return false; }
	return true;
};

export const renderToNodeStream = (res, reactElement)=> {
	res.setHeader('content-type', 'text/html');
	return ReactDOMServer.renderToNodeStream(reactElement)
	.pipe(res);
};

export const getInitialData = (req)=> {
	const hostname = req.hostname;
	const whereQuery = hostname.indexOf('.pubpub.org') > -1
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
		queryString: req.query
			? `?${queryString.stringify(req.query)}`
			: '',
		isBasePubPub: hostname === 'www.pubpub.org',

	};

	/* If basePubPub - return fixed data */
	if (locationData.isBasePubPub) {
		return new Promise((resolvePromise)=> {
			resolvePromise({
				communityData: {
					title: 'PubPub',
					description: 'Collaborative Community Publishing',
					favicon: '/favicon.png',
					smallHeaderLogo: '/static/icon.png',
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

		loginData.isAdmin = communityData.admins.reduce((prev, curr)=> {
			if (curr.id === user.id) { return true; }
			return prev;
		}, false);

		communityData.collections = communityData.collections.filter((item)=> {
			return loginData.isAdmin || item.isPublic;
		});

		const outputData = {
			communityData: communityData,
			loginData: loginData,
			locationData: locationData,
		};
		const notificationCount = loginData.id
			? getNotificationsCount(communityData.id, loginData.id)
			: 0;
		return Promise.all([outputData, notificationCount]);
	})
	.then(([outputData, notificationCount])=> {
		return {
			...outputData,
			loginData: {
				...loginData,
				notificationCount: notificationCount
			}
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
			err.message === 'Pub Not Found' ||
			err.message === 'User Not Admin' ||
			err.message === 'User Not Found'
		) {
			return next();
		}
		console.log('Err', err);
		return res.status(500).json('Error');
	};
};

export const generateHash = (length)=> {
	const tokenLength = length || 32;
	const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

	let hash = '';
	for (let index = 0; index < tokenLength; index++) {
		hash += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return hash;
};

export function generateCitationHTML(pubData, communityData) {
	if (!pubData.versions.length) { return null; }

	const pubIssuedDate = new Date(pubData.updatedAt);
	const versionIssuedDate = new Date(pubData.versions[0].updatedAt);
	const commonData = {
		// id: pubData.id,
		type: 'article-journal',
		title: pubData.title,
		// DOI: pubData.doi,
		author: pubData.collaborators.filter((item)=> {
			return item.Collaborator.isAuthor;
		}).sort((foo, bar)=> {
			if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
			if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
			return 0;
		}).map((author)=> {
			return {
				given: author.firstName,
				family: author.lastName,
			};
		}),
		'container-title': communityData.title,
		// issued: [{
		// 	'date-parts': [issuedDate.getFullYear(), issuedDate.getMonth() + 1, issuedDate.getDate()]
		// }],
	};
	const pubCiteObject = new Cite({
		...commonData,
		id: pubData.id,
		DOI: pubData.doi,
		ISSN: pubData.doi ? (communityData.issn || '2471–2388') : null,
		issued: [{
			'date-parts': [pubIssuedDate.getFullYear(), pubIssuedDate.getMonth() + 1, pubIssuedDate.getDate()]
		}],
	});
	const versionCiteObject = new Cite({
		...commonData,
		id: pubData.versions[0].id,
		DOI: pubData.versions[0].doi,
		ISSN: pubData.versions[0].doi ? (communityData.issn || '2471–2388') : null,
		issued: [{
			'date-parts': [versionIssuedDate.getFullYear(), versionIssuedDate.getMonth() + 1, versionIssuedDate.getDate()]
		}],
		version: pubData.versions[0].id,
	});

	// const apaOutput = pubCiteObject.get({ format: 'string', type: 'html', style: 'citation-apa', lang: 'en-US' }).replace(/\n/gi, ''),
	// const bibtexOutput = pubCiteObject.get({ format: 'string', type: 'html', style: 'bibtex', lang: 'en-US'}),

	return {
		pub: {
			apa: pubCiteObject.get({ format: 'string', type: 'html', style: 'citation-apa', lang: 'en-US' }).replace(/\n/gi, ''),
			bibtex: pubCiteObject.get({ format: 'string', type: 'html', style: 'bibtex', lang: 'en-US' }),
		},
		version: {
			apa: versionCiteObject.get({ format: 'string', type: 'html', style: 'citation-apa', lang: 'en-US' }).replace(/\n/gi, ''),
			bibtex: versionCiteObject.get({ format: 'string', type: 'html', style: 'bibtex', lang: 'en-US' }),
		}
	};
}

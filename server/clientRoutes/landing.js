import Promise from 'bluebird';
import React from 'react';
import Landing from 'containers/Landing/Landing';
import Html from '../Html';
import app from '../server';
import analytics from '../analytics';
import { Community, Pub, Discussion, sequelize } from '../models';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/', (req, res, next)=> {
	if (!hostIsValid(req, 'pubpub')) { return next(); }
	analytics(req);

	const getDiscussions = Discussion.findAll({
		where: {
			isPublic: true,
		},
		limit: 100,
		attributes: ['communityId'],
		order: [
			['createdAt', 'DESC']
		]
	});

	const getPubs = Pub.findAll({
		where: {
			firstPublishedAt: { $ne: null },
		},
		limit: 100,
		attributes: ['communityId'],
		order: [
			['firstPublishedAt', 'DESC']
		]
	});

	return Promise.all([getInitialData(req), getDiscussions, getPubs])
	.then(([initialData, discussions, pubs])=> {
		const activeCommunities = {};
		discussions.forEach((discussion)=> {
			if (activeCommunities[discussion.communityId]) {
				activeCommunities[discussion.communityId] += 1;
			} else {
				activeCommunities[discussion.communityId] = 1;
			}
		});
		pubs.forEach((pub)=> {
			if (activeCommunities[pub.communityId]) {
				activeCommunities[pub.communityId] += 5;
			} else {
				activeCommunities[pub.communityId] = 5;
			}
		});
		const activeCommunityIds = Object.keys(activeCommunities).filter((item)=> {
			if (item === 'a1bd113d-37f6-43f2-a77f-306613012e77') { return false; }
			return true;
		}).sort((foo, bar)=> {
			if (activeCommunities[foo] > activeCommunities[bar]) { return -1; }
			if (activeCommunities[foo] < activeCommunities[bar]) { return 1; }
			return 0;
		});
		const getActiveCommunities = Community.findAll({
			where: {
				id: { $in: activeCommunityIds.slice(0, 6) }
			},
			attributes: [
				'id', 'subdomain', 'domain', 'title', 'description', 'largeHeaderBackground',
				'largeHeaderLogo', 'accentColor', 'accentTextColor',
				[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('pubs.id'))), 'numPubs'],
				[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('discussions.id'))), 'numDiscussions'],
			],
			group: ['Community.id'],
			include: [
				{ model: Pub, as: 'pubs', attributes: [] },
				{ model: Discussion, as: 'discussions', attributes: [] }
			],
		});
		return Promise.all([initialData, getActiveCommunities]);
	})
	.then(([initialData, activeCommunitiesData])=> {
		const newInitialData = {
			...initialData,
			landingData: { activeCommunities: activeCommunitiesData },
		};
		return renderToNodeStream(res,
			<Html
				chunkName="Landing"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: newInitialData,
					title: 'PubPub',
					description: initialData.communityData.description,
				})}
			>
				<Landing {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});

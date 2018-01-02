import React from 'react';
import Explore from 'containers/Explore/Explore';
import Html from '../Html';
import app from '../server';
import { Community, Pub, Discussion, sequelize } from '../models';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/explore', (req, res, next)=> {
	if (!hostIsValid(req, 'pubpub')) { return next(); }

	const getExploreData = Community.findAll({
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

	return Promise.all([getInitialData(req), getExploreData])
	.then(([initialData, exploreData])=> {
		const newInitialData = {
			...initialData,
			exploreData: exploreData,
		};
		return renderToNodeStream(res,
			<Html
				chunkName="Explore"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: newInitialData,
					title: 'Explore · PubPub',
					description: 'Explore the active communities built on PubPub.',
				})}
			>
				<Explore {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});

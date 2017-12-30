import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Promise from 'bluebird';
import NoMatch from 'containers/NoMatch/NoMatch';
import Html from '../Html';
import app from '../server';
import { User, Community, Collection } from '../models';
import { getCommunity } from '../utilities';

app.get('/testing', (req, res)=> {
	console.time('Testing');
	const hostname = 'pubpub.ito.com';
	return Community.findOne({
		where: {
			domain: hostname
		},
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
	.then((data)=> {
		console.timeEnd('Testing');
		return res.status(201).json(data);
	})
	.catch((data)=> {
		console.timeEnd('Testing');
		console.log(data);
		return res.status(500).json(data);
	})
});

app.use((req, res)=> {
	res.status(404);

	return Promise.all([getCommunity(req), User.findOne()])
	.then(([communityData, loginData])=> {
		const initialData = {
			loginData: loginData,
			communityData: communityData,
			isBasePubPub: false,
		};
		return ReactDOMServer.renderToNodeStream(
			<Html
				chunkName="NoMatch"
				initialData={initialData}
				headerComponents={[
					<title key="meta-title">{`Not Found · ${communityData.title}`}</title>,
				]}
			>
				<NoMatch {...initialData} />
			</Html>
		)
		.pipe(res);
	})
	.catch((err)=> {
		console.log('Err', err);
		return res.status(500).json('Error');
	});
});

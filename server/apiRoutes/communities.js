import uuidv4 from 'uuid/v4';
import Color from 'color';
import app from '../server';
import { Community, Collection, CommunityAdmin } from '../models';
import { generateHash } from '../utilities';

app.post('/api/communities', (req, res)=> {
	const user = req.user || {};
	if (!user.id) { return res.status(500).json('Must be logged in to create a community'); }

	const newCommunityId = uuidv4();
	const newCollectionIds = [uuidv4(), uuidv4(), uuidv4()];
	const subdomain = req.body.subdomain.replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/gi, '').toLowerCase();

	const subdomainBlacklist = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'www', 'dev', 'assets', 'jake', 'resize'];
	if (subdomainBlacklist.indexOf(subdomain) > -1) { return res.status(500).json('URL already used'); }

	const collections = [
		{
			id: newCollectionIds[0],
			title: 'Home',
			slug: '',
			communityId: newCommunityId,
			isPage: false,
			isPublic: true,
			isOpenSubmissions: false,
			isOpenPublish: false,
			createPubHash: generateHash(8),
		},
		{
			id: newCollectionIds[1],
			title: 'Open Submissions',
			slug: 'open-submissions',
			communityId: newCommunityId,
			isPage: false,
			isPublic: true,
			isOpenSubmissions: true,
			isOpenPublish: true,
			createPubHash: generateHash(8),
		},
		{
			id: newCollectionIds[2],
			title: 'Private Pubs',
			slug: 'private-pubs',
			communityId: newCommunityId,
			isPage: false,
			isPublic: false,
			isOpenSubmissions: true,
			isOpenPublish: false,
			createPubHash: generateHash(8),
		}
	];
	return Community.findOne({
		where: { subdomain: subdomain },
		attributes: ['id', 'subdomain']
	})
	.then((existingCommunity)=> {
		if (existingCommunity) {
			throw new Error('URL already used');
		}
		return Community.create({
			id: newCommunityId,
			subdomain: subdomain,
			title: req.body.title,
			description: req.body.description.substring(0, 280).replace(/\n/g, ' ') || '',
			// favicon: 'https://assets.pubpub.org/1egggt4v/61507218546278.png',
			smallHeaderLogo: req.body.smallHeaderLogo,
			largeHeaderLogo: req.body.largeHeaderLogo,
			// largeHeaderBackground: 'https://assets.pubpub.org/9s4gbj5y/51507218425793.png',
			accentColor: req.body.accentColor,
			accentTextColor: Color(req.body.accentColor).light() ? '#000000' : '#FFFFFF',
			accentHoverColor: Color(req.body.accentColor).fade(0.2).rgb().string(),
			accentActionColor: Color(req.body.accentColor).fade(0.4).rgb().string(),
			accentMinimalColor: Color(req.body.accentColor).fade(0.8).rgb().string(),
			navigation: newCollectionIds,
		});
	})
	.then(()=> {
		return Collection.bulkCreate(collections);
	})
	.then(()=> {
		return CommunityAdmin.create({
			communityId: newCommunityId,
			userId: user.id
		});
	})
	.then(()=> {
		return res.status(201).json(`https://${subdomain}.pubpub.org`);
	})
	.catch((err)=> {
		if (err.message === 'URL already used') {
			return res.status(500).json('URL already used');
		}
		console.log('Error posting Community', err);
		return res.status(500).json('Error Creating Community');
	});
});


app.put('/api/communities', (req, res)=> {
	const user = req.user || {};

	// Filter to only allow certain fields to be updated
	const updatedCommunity = {};
	Object.keys(req.body).forEach((key)=> {
		if ([
			'title',
			'subdomain',
			'description',
			'avatar',
			'favicon',
			'smallHeaderLogo',
			'largeHeaderLogo',
			'largeHeaderBackground',
			'accentColor',
			'navigation',
			'website',
			'twitter',
			'facebook',
			'email',
		].indexOf(key) > -1) {
			updatedCommunity[key] = req.body[key] && req.body[key].trim ? req.body[key].trim() : req.body[key];
		}
	});
	if (updatedCommunity.subdomain) {
		updatedCommunity.subdomain = updatedCommunity.subdomain.replace(/[^a-zA-Z0-9-]/gi, '').replace(/ /g, '-').toLowerCase();
	}
	if (updatedCommunity.accentColor) {
		const accentColor = updatedCommunity.accentColor;
		updatedCommunity.accentTextColor = Color(accentColor).light() ? '#000000' : '#FFFFFF';
		updatedCommunity.accentHoverColor = Color(accentColor).fade(0.2).rgb().string();
		updatedCommunity.accentActionColor = Color(accentColor).fade(0.4).rgb().string();
		updatedCommunity.accentMinimalColor = Color(accentColor).fade(0.8).rgb().string();
	}

	CommunityAdmin.findOne({
		where: { userId: user.id, communityId: req.body.communityId },
		raw: true,
	})
	.then((collaboratorData)=> {
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859' && !collaboratorData) {
			throw new Error('Not Authorized to update this community');
		}
		return Community.update(updatedCommunity, {
			where: { id: req.body.communityId }
		});
	})
	.then(()=> {
		return res.status(201).json(updatedCommunity);
	})
	.catch((err)=> {
		console.log('Error putting Pub', err);
		return res.status(500).json(err);
	});
});

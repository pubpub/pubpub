import React from 'react';

import Html from 'server/Html';
import app from 'server/server';
import { getUser } from 'server/utils/queryHelpers';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';
import { Collection, CollectionAttribution, Member, PubAttribution, Pub } from 'server/models';

// check if member has any pubs or collections for user
const getCountOfPubsOrCollections = async (userData, communityData) => {
	const promises = [
		Member.count({
			where: {
				communityId: communityData,
				userId: userData,
			},
		}),

		Member.count({
			where: {
				userId: userData,
			},
			include: [
				{
					model: Pub,
					as: 'pub',
					where: {
						communityId: communityData,
					},
				},
			],
		}),

		Member.count({
			where: {
				userId: userData,
			},
			include: [
				{
					model: Collection,
					as: 'collection',
					where: {
						communityId: communityData,
					},
				},
			],
		}),

		PubAttribution.count({
			where: {
				userId: userData,
			},
			include: [
				{
					model: Pub,
					as: 'pub',
					where: {
						communityId: communityData,
					},
				},
			],
		}),

		CollectionAttribution.count({
			where: {
				userId: userData,
			},
			include: [
				{
					model: Collection,
					as: 'collection',
					where: {
						communityId: communityData,
					},
				},
			],
		}),
	];

	const counts = await Promise.all(promises);

	// indicates if user is present
	const isHere = counts.some((c) => c > 0);
	return isHere;
};

app.get(['/user/:slug', '/user/:slug/:mode'], async (req, res, next) => {
	try {
		const initialData = await getInitialData(req);
		const userData = await getUser(req.params.slug, initialData);
		const isNewishUser = Date.now() - userData.createdAt.valueOf() < 1000 * 86400 * 30;
		const isThisUserAPartOfThisCOmmunity = await getCountOfPubsOrCollections(
			userData.id,
			initialData.communityData.id,
		);
		if (!isThisUserAPartOfThisCOmmunity) {
			return res.redirect(`https://www.pubpub.org/user/${userData.slug}`);
		}
		console.log(isThisUserAPartOfThisCOmmunity);
		return renderToNodeStream(
			res,
			<Html
				chunkName="User"
				initialData={initialData}
				viewData={{ userData }}
				headerComponents={generateMetaComponents({
					initialData,
					title: `${userData.fullName} · PubPub`,
					description: userData.bio,
					image: userData.avatar,
					canonicalUrl: `https://www.pubpub.org/user/${userData.slug}`,
					unlisted: isNewishUser,
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});

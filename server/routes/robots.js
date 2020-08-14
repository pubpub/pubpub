import app from 'server/server';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { communityUrl } from 'utils/canonicalUrls';

const getCommunityRobots = (community) => `User-agent: *
Disallow:
Sitemap: ${communityUrl(community)}/sitemap-index.xml
`;

app.get('/robots.txt', async (req, res, next) => {
	if (!hostIsValid(req, 'community')) {
		return next();
	}

	try {
		const { communityData } = await getInitialData(req, true);

		res.header('Content-Type', 'text/plain');
		return res.send(getCommunityRobots(communityData));
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});

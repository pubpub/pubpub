import app from 'server/server';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { communityUrl } from 'utils/canonicalUrls';

const BASE_ROBOTS = `User-agent: *
Disallow:`;

const buildRobotsFile = (community) => {
	if (community) {
		return `${BASE_ROBOTS}
Sitemap: ${communityUrl(community)}/sitemap-index.xml`;
	}
	return BASE_ROBOTS;
};

app.get('/robots.txt', async (req, res, next) => {
	if (!hostIsValid(req, 'community')) {
		return buildRobotsFile();
	}

	try {
		const { communityData } = await getInitialData(req, true);

		res.header('Content-Type', 'text/plain');
		return res.send(buildRobotsFile(communityData));
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});

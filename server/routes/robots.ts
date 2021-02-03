import stripIndent from 'strip-indent';

import app, { wrap } from 'server/server';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { communityUrl } from 'utils/canonicalUrls';

const BASE_ROBOTS = stripIndent(`
	User-agent: *
	Disallow:
`);

const buildRobotsFile = (community) => {
	if (community) {
		return stripIndent(`
			${BASE_ROBOTS}
			Sitemap: ${communityUrl(community)}/sitemap-index.xml
		`);
	}
	return BASE_ROBOTS;
};

app.get(
	'/robots.txt',
	wrap(async (req, res) => {
		let communityData;
		if (hostIsValid(req, 'community')) {
			const initData = await getInitialData(req, true);
			communityData = initData.communityData;
		}

		res.header('Content-Type', 'text/plain');
		return res.send(buildRobotsFile(communityData));
	}),
);

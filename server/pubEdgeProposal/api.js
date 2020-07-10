import app, { wrap } from 'server/server';
import { parseUrl } from 'utils/urls';
import { isDoi } from 'utils/crossref/isDoi';

import { getPubDataFromUrl, createPubEdgeProposalFromCrossrefDoi } from './queries';

app.get(
	'/api/pubEdgeProposal',
	wrap(async (req, res) => {
		const { object } = req.query;
		const url = parseUrl(object);
		let edge = null;

		if (url) {
			const pub = await getPubDataFromUrl(url);
			if (pub) {
				// URL is not PubPub
				// TODO: Scrape target for DOI
				edge = { targetPub: pub };
			}
		} else if (isDoi(object)) {
			edge = await createPubEdgeProposalFromCrossrefDoi(object);
		}

		return res.status(200).json(edge);
	}),
);

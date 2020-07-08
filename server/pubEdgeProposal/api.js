import fetch from 'node-fetch';

import app, { wrap } from 'server/server';
import { parseUrl } from 'utils/urls';
import { isDoi } from 'utils/dois';

import { getPubDataFromUrl } from './queries';

const createPubEdgeProposalFromPub = (pub, url) => {
	const { attributions, avatar, description, doi, lastPublishedAt, title } = pub;
	const contributors = attributions.map((a) => a.name);

	return {
		targetPub: {
			avatar: avatar,
			contributors: contributors,
			description: description,
			doi: doi,
			publicationDate: lastPublishedAt,
			title: title,
			url: url,
		},
	};
};

const createPubEdgeProposalFromCrossRefWork = (crossRefWork) => {
	const {
		message: { abstract, author, DOI, title, URL },
	} = crossRefWork;
	const contributors = author.map(({ given, family }) => `${given} ${family}`);

	return {
		externalPublication: {
			avatar: null,
			contributors: contributors,
			description: abstract,
			doi: DOI,
			title: title,
			url: URL,
		},
	};
};

app.get(
	'/api/pubEdgeProposal',
	wrap(async (req, res) => {
		const { object } = req.query;
		const url = parseUrl(object);

		let edge;

		if (url) {
			const pub = await getPubDataFromUrl(url);

			if (!pub) {
				// URL is not PubPub
				// TODO: Scrape target for DOI
				return res.status(404);
			}

			edge = createPubEdgeProposalFromPub(pub, url);

			return res.status(200).json(edge);
		} else if (isDoi(object)) {
			const response = await fetch(`https://api.crossref.org/works/${object}`);
			const crossRefWork = await response.json();

			edge = createPubEdgeProposalFromCrossRefWork(crossRefWork);
		}

		if (edge) {
			return res.status(200).json(edge);
		}

		return res.status(404);
	}),
);

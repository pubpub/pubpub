import fetch from 'node-fetch';
import { Op } from 'sequelize';
import mergewith from 'lodash.mergewith';

import { Community, Pub } from 'server/models';
import { pubEdgeQueries, runQueries } from 'utils/scrape';
import { parseUrl } from 'utils/urls';
import { getOptionsForIncludedPub } from 'server/utils/queryHelpers/edgeOptions';

const ensureFullUrlForExternalPublication = (externalPublication, responseUrl) => {
	if (externalPublication.url && /^\//.test(externalPublication.url)) {
		const { origin } = parseUrl(responseUrl);
		const url = new URL(externalPublication.url, origin);

		return { ...externalPublication, url: url };
	}

	return externalPublication;
};

const mergeProposalWithCrossrefProposal = async (edge, doi) => {
	const proposalFromDoi = await createPubEdgeProposalFromCrossrefDoi(doi);

	return {
		...edge,
		externalPublication: mergewith(
			{},
			edge.externalPublication,
			proposalFromDoi.externalPublication,
			(a, b) => b ?? a,
		),
	};
};

export const createPubEdgeProposalFromCrossrefDoi = async (doi) => {
	const response = await fetch(`https://api.crossref.org/works/${doi}`);
	const { message } = await response.json();
	const {
		abstract,
		author,
		DOI,
		title,
		URL,
		'published-online': publishedOnline,
		'published-print': publishedPrint,
	} = message;
	const contributors = author ? author.map(({ given, family }) => `${given} ${family}`) : [];
	const dateParts = (publishedOnline || publishedPrint)['date-parts'];
	const publicationDate = new Date(dateParts);

	return {
		externalPublication: {
			avatar: null,
			contributors: contributors,
			description: abstract,
			doi: DOI,
			publicationDate: publicationDate,
			title: Array.isArray(title) ? title[0] : title,
			url: URL,
		},
	};
};

export const createPubEdgeProposalFromArbitraryUrl = async (url) => {
	const response = await fetch(url);
	const externalPublication = await runQueries(pubEdgeQueries, response);
	const edge = {
		externalPublication: ensureFullUrlForExternalPublication(externalPublication, response.url),
	};
	const { doi } = externalPublication;

	return doi ? await mergeProposalWithCrossrefProposal(edge, doi) : edge;
};

export const getPubDataFromUrl = async (url) => {
	const { hostname, pathname } = url;
	const matches = pathname.match(/^\/pub\/(\w+)/);

	if (!matches) {
		return null;
	}

	const communityName = hostname.split('.')[0];
	const slug = matches[1];

	const community = await Community.findOne({
		where: {
			[Op.or]: [{ domain: hostname }, { subdomain: communityName }],
		},
	});

	if (!community) {
		return null;
	}

	const pub = await Pub.findOne({
		where: {
			communityId: community.id,
			slug: slug,
		},
		include: getOptionsForIncludedPub({ includeCommunity: false }),
	});

	return pub || null;
};

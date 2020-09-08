/* global it, expect, beforeAll */
import { setup } from 'stubstub';

import { getQueriedPubIds } from '../queries';
import { models } from './data';

setup(beforeAll, async () => {
	await models.resolve();
});

const expectQuery = (query) => {
	const { community } = models;
	return {
		toReturn: async (pubs) => {
			const pubIds = await getQueriedPubIds({
				communityId: community.id,
				query: query,
				limit: 25,
			});
			expect(pubIds).toEqual(pubs.map((pub) => pub.id));
		},
	};
};

it('returns only released Pubs', async () => {
	const { p2, p3, p4, p5, p1, p6 } = models;
	console.log([p1, p2, p3, p4, p5, p6].map((p) => p.id));
	await expectQuery({}).toReturn([p5, p4, p3, p2]);
});

it('filters out child pubs when connections=false', async () => {
	const { p3, p4, p5 } = models;
	await expectQuery({ connections: false }).toReturn([p5, p4, p3]);
});

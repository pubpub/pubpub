import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import { expect } from 'utils/assert';
import { createGetRequestIds } from 'utils/getRequestIds';
import { validate } from 'utils/api';
import { z } from 'zod';
import { DEFAULT_ROLES, UpdateParams } from 'types';
import { getPermissions } from './permissions';
import {
	createPubAttribution,
	updatePubAttribution,
	destroyPubAttribution,
	getPubAttributions,
} from './queries';
import { PubAttribution } from './model';

const getRequestIds = createGetRequestIds<{
	communityId?: string;
	pubId?: string;
	id?: string;
}>();

// const getRequestIds = (req) => {
// 	const user = req.user || {};
// 	return {
// 		userId: user.id,
// 		communityId: req.body.communityId,
// 		pubId: req.body.pubId,
// 		pubAttributionId: req.body.id,
// 	};
// };
const attributionSchema = z
	.object({
		order: z.number().default(0.5),
		roles: z.array(z.string()).default([]).openapi({ example: DEFAULT_ROLES }),
		affiliation: z.string().optional(),
		isAuthor: z.boolean().optional(),
	})
	.and(
		z.union([
			z.object({
				userId: z.string(),
				name: z.undefined().optional(),
				orcid: z.undefined().optional(),
			}),
			z.object({
				userId: z.undefined().optional(),
				name: z.string(),
				orcid: z.string().optional(),
			}),
		]),
	) satisfies z.ZodType<
	{
		order?: number;
		roles?: string[];
		affiliation?: string;
		isAuthor?: boolean;
	} & (
		| {
				userId: string;
				name?: undefined;
				orcid?: undefined;
		  }
		| {
				name: string;
				userId?: undefined;
				orcid?: string;
		  }
	)
>;

app.post(
	'/api/pubAttributions/batch',
	validate({
		description: 'Batch create pub attributions',
		body: z.object({
			attributions: z.array(attributionSchema),
			communityId: z.string(),
			pubId: z.string(),
		}),
	}),
	wrap(async (req, res) => {
		const { attributions } = req.body;
		const requestIds = getRequestIds(req);
		const permissions = await getPermissions(requestIds);

		if (!permissions.create) {
			throw new ForbiddenError();
		}

		const existingAttributions = await getPubAttributions(requestIds.pubId);
		const orderingBase = expect(
			existingAttributions.length ? existingAttributions.concat().pop()?.order : 1,
		);

		const newAttributions = await Promise.all(
			attributions
				.filter(
					(attr) =>
						!existingAttributions.some(
							(existingAttr) => existingAttr.userId === attr.userId,
						),
				)
				.map((attr, index, { length }) =>
					createPubAttribution({
						pubId: requestIds.pubId,
						...attr,
						order: orderingBase / 2 ** (length - index),
					}),
				),
		);

		return res
			.status(201)
			.json([...existingAttributions, ...newAttributions].sort((a, b) => a.order - b.order));
	}),
);

app.post(
	'/api/pubAttributions',
	validate({
		description: 'Create a pub attribution',
		body: z
			.object({
				communityId: z.string(),
				pubId: z.string(),
			})
			.and(attributionSchema),
	}),
	(req, res) => {
		getPermissions(getRequestIds(req))
			.then((permissions) => {
				if (!permissions.create) {
					throw new Error('Not Authorized');
				}
				return createPubAttribution({
					...req.body,
				});
			})
			.then((newPubAttribution) => {
				return res.status(201).json(newPubAttribution);
			})
			.catch((err) => {
				console.error('Error in postPubAttribution: ', err);
				return res.status(500).json(err.message);
			});
	},
);

app.put(
	'/api/pubAttributions',
	validate({
		description: 'Update a pub attribution',
		body: z.object({
			id: z.string(),
			communityId: z.string(),
			pubId: z.string(),
			order: z.number().optional(),
			roles: z.array(z.string()).openapi({ example: DEFAULT_ROLES }),
			affiliation: z.string().optional(),
			isAuthor: z.boolean().optional(),
			name: z.string(),
			userId: z.string(),
			orcid: z.string(),
		}) satisfies z.ZodType<UpdateParams<PubAttribution>>,
	}),
	(req, res) => {
		const requestIds = getRequestIds(req);
		getPermissions(requestIds)
			.then((permissions) => {
				if (!permissions.update) {
					throw new Error('Not Authorized');
				}
				return updatePubAttribution(
					{
						...req.body,
						pubAttributionId: req.body.id,
					},
					permissions.update,
				);
			})
			.then((updatedValues) => {
				return res.status(201).json(updatedValues);
			})
			.catch((err) => {
				console.error('Error in putPubAttribution: ', err);
				return res.status(500).json(err.message);
			});
	},
);

app.delete(
	'/api/pubAttributions',
	validate({
		description: 'Delete a pub attribution',
		body: z.object({
			id: z.string().openapi({ description: 'The attribution id' }),
			communityId: z.string(),
			pubId: z.string(),
		}),
		statusCodes: {
			201: z.string().openapi({ description: 'The id of the deleted attribution' }),
		},
	}),
	(req, res) => {
		getPermissions(getRequestIds(req))
			.then((permissions) => {
				if (!permissions.destroy) {
					throw new Error('Not Authorized');
				}
				return destroyPubAttribution({
					...req.body,
					pubAttributionId: req.body.id,
				});
			})
			.then(() => {
				return res.status(201).json(req.body.id);
			})
			.catch((err) => {
				console.error('Error in deletePubAttribution: ', err);
				return res.status(500).json(err.message);
			});
	},
);

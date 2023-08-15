import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import { createGetRequestIds } from 'utils/getRequestIds';
import { validate } from 'utils/api';
import { z } from 'zod';
import { attributionSchema, updateAttributionSchema } from 'server/pubAttribution/api';
import { UpdateParams } from 'types';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { CollectionAttribution } from './model';
import {
	createCollectionAttribution,
	updateCollectionAttribution,
	destroyCollectionAttribution,
} from './queries';
import { getPermissions } from './permissions';

extendZodWithOpenApi(z);

const getRequestIds = createGetRequestIds<{
	communityId?: string;
	collectionId?: string;
	id?: string;
}>();

// const getRequestIds = (req) => {
// 	const user = req.user || {};
// 	return {
// 		userId: user.id,
// 		communityId: req.body.communityId,
// 		collectionId: req.body.collectionId,
// 		collectionAttributionId: req.body.id,
// 	};
// };

/* Note: we typically use values like collectionAttributionId on API requests */
/* here, id is sent up, so there is a little bit of kludge to make */
/* the other interfaces consistent. I didn't fully understand AttributionEditor */
/* so I didn't make the downstream change, which would be the right solution. */
app.post(
	'/api/collectionAttributions',
	validate({
		tags: ['CollectionAttributions'],
		description: 'Create a collection attribution',
		body: z
			.object({
				communityId: z.string(),
				collectionId: z.string(),
			})
			.and(attributionSchema),
	}),
	wrap(async (req, res) => {
		const permissions = await getPermissions(getRequestIds(req));
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const newAttribution = await createCollectionAttribution({
			...req.body,
			//			collectionAttributionId: req.body.id,
		});
		return res.status(201).json(newAttribution);
	}),
);

app.put(
	'/api/collectionAttributions',
	validate({
		tags: ['CollectionAttributions'],
		description: 'Update a collection attribution',
		body: updateAttributionSchema.merge(
			z.object({ collectionId: z.string() }),
		) satisfies z.ZodType<UpdateParams<CollectionAttribution>>,
	}),
	wrap(async (req, res) => {
		const permissions = await getPermissions(getRequestIds(req));
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		const updatedValues = await updateCollectionAttribution(
			{
				...req.body,
				collectionAttributionId: req.body.id,
			},
			permissions.update,
		);
		return res.status(200).json(updatedValues);
	}),
);

app.delete(
	'/api/collectionAttributions',
	validate({
		description: 'Delete a collection attribution',
		security: true,
		tags: ['CollectionAttributions'],
		body: z.object({
			id: z.string().openapi({ description: 'The attribution id' }),
			communityId: z.string(),
			collectionId: z.string(),
		}),
		response: z.string().openapi({ description: 'The id of the deleted attribution' }),
	}),
	wrap(async (req, res) => {
		const permissions = await getPermissions(getRequestIds(req));
		if (!permissions.destroy) {
			throw new ForbiddenError();
		}
		await destroyCollectionAttribution({
			...req.body,
			collectionAttributionId: req.body.id,
		});
		return res.status(200).json(req.body.id);
	}),
);

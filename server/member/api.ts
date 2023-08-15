import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import { createGetRequestIds } from 'utils/getRequestIds';
import { validate } from 'utils/api';
import { z } from 'zod';
import { memberPermissions } from 'types';
import { getPermissions } from './permissions';
import { createMember, updateMember, destroyMember } from './queries';

const getRequestIds = createGetRequestIds<{
	communityId?: string;
	pubId?: string;
	collectionId?: string;
}>();

// const getRequestIds = (req) => {
// 	const user = req.user || {};
// 	const { pubId, collectionId, communityId } = req.body;
// 	return {
// 		pubId,
// 		collectionId,
// 		communityId,
// 		actorId: user.id,
// 	};
// };

const chooseTargetFromRequestIds = ({
	pubId,
	collectionId,
	communityId,
}: {
	pubId?: string;
	collectionId?: string;
	communityId?: string;
}) => {
	if (pubId) {
		return { pubId };
	}
	if (collectionId) {
		return { collectionId };
	}
	if (communityId) {
		return { communityId };
	}
	return {};
};

const idUnionSchema = z.object({
	communityId: z.string(),
	collectionId: z.string().optional(),
	pubId: z.string().optional(),
});

app.post(
	'/api/members',
	validate({
		tags: ['Members'],
		description: 'Create a member',
		security: true,
		body: z
			.object({
				value: z.object({
					permissions: z.enum(memberPermissions).optional().default('view'),
				}),
				targetUserId: z.string(),
			})
			.and(idUnionSchema),
	}),
	wrap(async (req, res) => {
		const { pubId, collectionId, communityId, userId: actorId } = getRequestIds(req);
		const { targetUserId, value } = req.body;
		const permissions = await getPermissions({
			actorId,
			pubId,
			communityId,
			collectionId,
			value,
		});
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const member = await createMember({
			value,
			actorId: req.user.id,
			target: {
				userId: targetUserId,
				...chooseTargetFromRequestIds({
					pubId,
					collectionId,
					communityId,
				}),
			},
		});
		return res.status(201).json(member);
	}),
);

app.put(
	'/api/members',
	validate({
		tags: ['Members'],
		description: 'Update a member',
		body: z
			.object({
				id: z.string(),
				value: z.object({
					permissions: z.enum(memberPermissions).optional(),
					subscribedToActivityDigest: z.boolean().optional(),
				}),
			})
			.and(idUnionSchema),
		response: {
			id: z.string(),
			permissions: z.enum(memberPermissions),
			isOwner: z.boolean().nullable(),
			subscribedToActivityDigest: z.boolean(),
		},
	}),
	wrap(async (req, res) => {
		const { pubId, collectionId, communityId, userId: actorId } = getRequestIds(req);
		const { value, id: memberId } = req.body;
		const permissions = await getPermissions({
			actorId,
			pubId,
			communityId,
			collectionId,
			memberId,
			value,
		});
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		const member = await updateMember({
			value,
			memberId,
			actorId: req.user.id,
		});
		return res.status(200).json(member);
	}),
);

app.delete(
	'/api/members',
	validate({
		tags: ['Members'],
		description: 'Delete a member',
		body: z
			.object({
				id: z.string(),
				value: z.object({
					permissions: z.enum(memberPermissions).optional(),
				}),
			})
			.and(idUnionSchema),
		response: z.string({ description: 'The ID of the deleted member' }),
	}),
	wrap(async (req, res) => {
		const { pubId, collectionId, communityId, userId: actorId } = getRequestIds(req);
		const { value, id } = req.body;
		const permissions = await getPermissions({
			actorId,
			pubId,
			communityId,
			collectionId,
			memberId: id,
			value,
		});
		if (!permissions.destroy) {
			throw new ForbiddenError();
		}
		await destroyMember({ memberId: id, actorId: req.user.id });
		return res.status(200).json(id);
	}),
);

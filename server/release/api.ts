import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import * as types from 'types';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

import { getPermissions } from './permissions';
import { createRelease, ReleaseQueryError } from './queries';

extendZodWithOpenApi(z);

const getRequestValues = (req) => {
	const user = req.user || {};
	const { communityId, historyKey, noteContent, noteText, pubId } = req.body;
	return {
		communityId,
		historyKey,
		noteContent,
		noteText,
		pubId,
		userId: user.id,
	};
};

export const releaseSchema = z.object({
	id: z.string().uuid(),
	noteContent: z.record(z.any()).nullable(),
	noteText: z.string().nullable(),
	pubId: z.string().uuid(),
	userId: z.string().uuid(),
	docId: z.string().uuid(),
	historyKey: z.number(),
	historyKeyMissing: z.boolean(),
}) satisfies z.ZodType<types.Release>;

app.post(
	'/api/releases',
	wrap(async (req, res) => {
		const { communityId, historyKey, noteContent, noteText, pubId, userId } =
			getRequestValues(req);
		const permissions = await getPermissions({
			userId,
			pubId,
			communityId,
		});

		if (!permissions.create) {
			throw new ForbiddenError();
		}

		try {
			const release = await createRelease({
				userId,
				pubId,
				historyKey,
				noteText,
				noteContent,
			});

			return res.status(201).json(release);
		} catch (error) {
			if (error instanceof ReleaseQueryError) {
				return res.status(400).json(error.message);
			}
			throw error;
		}
	}),
);

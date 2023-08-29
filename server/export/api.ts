import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import { oldCreateGetRequestIds } from 'utils/getRequestIds';
import { validate } from 'utils/api';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { exportFormatsArray } from 'utils/export/formats';
import { getPermissions } from './permissions';
import { getOrStartExportTask } from './queries';

extendZodWithOpenApi(z);

const getRequestData = oldCreateGetRequestIds<{
	accessHash?: string | null;
	format?: string;
	historyKey?: number;
	pubId?: string;
	communityId?: string;
}>();

app.post(
	'/api/export',
	validate({
		tags: ['Export'],
		description:
			"Export a pub to a file. Returns the export task's status. \n\nRequires authentication for unreleased pubs.",
		body: z.object({
			accessHash: z.string().nullish(),
			format: z.enum(exportFormatsArray),
			historyKey: z.number().int().nonnegative().default(0).openapi({
				description:
					'Which revision of the pub to export. Always tries to find the latest one, no real use for passing a value here unless you know of all the revisions.',
			}),
			pubId: z.string().openapi({
				description: 'The id of the pub to export.',
			}),
			communityId: z.string(),
		}),
		statusCodes: {
			201: z
				.object({
					taskId: z.string().openapi({
						description:
							'The id of the export task, if no existing export already exists.',
					}),
				})
				.openapi({
					title: 'Uncached export',
				})
				.or(
					z
						.object({
							url: z.string().openapi({
								description: 'The url of the already existing export.',
							}),
						})
						.openapi({
							title: 'Export is cached',
						}),
				),
		},
	}),
	wrap(async (req, res) => {
		const { accessHash, format, historyKey, pubId, userId, communityId } = getRequestData(req);
		const permissions = await getPermissions({
			accessHash,
			userId,
			pubId,
			communityId,
			historyKey,
		});

		if (!permissions.create) {
			throw new ForbiddenError();
		}

		const result = await getOrStartExportTask({
			format,
			historyKey,
			pubId,
		});

		return res.status(201).json(result);
	}),
);

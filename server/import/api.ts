import app from 'server/server';

import { validate } from 'utils/api';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createImport } from './queries';

extendZodWithOpenApi(z);

export const documentLabels = [
	'preamble',
	'document',
	'bibliography',
	'supplement',
	'metadata',
] as const;

export const sourceFileSchema = z.object({
	id: z.number().int().nonnegative(),
	state: z.string().default('complete'),
	clientPath: z.string(),
	loaded: z.number(),
	total: z.number(),
	label: z.enum(documentLabels).optional().openapi({
		description: 'What kind of document this is',
	}),
	assetKey: z.string().openapi({
		description: 'The key of the asset in AWS',
	}),
});

export const importerFlagNames = [
	'extractEndnotes',
	'keepStraightQuotes',
	'skipJatsBibExtraction',
] as const;

export const importerFlagsSchema = z.object({
	extractEndnotes: z.boolean()?.optional(),
	keepStraightQuotes: z.boolean().optional(),
	skipJatsBibExtraction: z.boolean().optional(),
});

app.post(
	'/api/import',
	validate({
		body: z.object({
			sourceFiles: z.array(sourceFileSchema),
			importerFlags: importerFlagsSchema.default({}),
		}),
		statusCodes: {
			201: z.string().openapi({
				description:
					"The UUID of the workerTask. You can ping '/api/workerTasks?workerTaskId={UUID}' to check the status of the import.",
			}),
			500: z.string(),
		},
	}),
	async (req, res) => {
		try {
			const taskData = await createImport(req.body);
			return res.status(201).json(taskData.id);
		} catch (err: any) {
			console.error('Error in postImport: ', err);
			return res.status(500).json(err.message);
		}
	},
);

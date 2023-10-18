import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const documentLabels = [
	'preamble',
	'document',
	'bibliography',
	'supplement',
	'metadata',
	'none',
] as const;

export const baseSourceFileSchema = z.object({
	state: z.string().default('complete'),
	clientPath: z.string(),
	loaded: z.number(),
	total: z.number(),
	label: z.enum(documentLabels).optional().openapi({
		description: 'What kind of document this is',
	}),
});
export const sourceFileSchema = baseSourceFileSchema.extend({
	id: z.number().int().nonnegative(),
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

export const createImportTaskSchema = z.object({
	sourceFiles: z.array(sourceFileSchema),
	importerFlags: importerFlagsSchema.default({}),
});

export type ImportBody = (typeof createImportTaskSchema)['_input'];

export type SourceFile = z.infer<typeof sourceFileSchema>;

export type BaseSourceFile = z.infer<typeof baseSourceFileSchema>;

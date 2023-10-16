import { z } from 'zod';

export const textMimeTypes = [
	'text/tex-x',
	'text/yaml',
	'application/json',
	'application/xml',
	'application/mods+xml',
	'application/x-research-info-systems',
	'text/markdown',
	'text/plain',
	'application/x-tex',
] as const;
/**
 * Non-exhaustive list of mime-types that we allow to be uploaded to PubPub,
 * minus image types, which are handled separately.
 */
export const allowedMimeTypes = [
	...textMimeTypes,
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/epub+zip',
	'text/html',
	'application/vnd.oasis.opendocument.text',
	'application/pdf',
] as const;

const fileSchema = z.union([z.string(), z.custom<Express.Multer.File>()]);

const mimeTypeSchema = z.union([z.enum(allowedMimeTypes), z.string().regex(/image\/.*/)]);

export const uploadSchema = z.union([
	z.object({
		name: z.string().optional(),
		file: z.custom<Blob>(),
	}),
	z.object({
		file: z.string(),
		fileName: z.string(),
		// mimeType: z.enum(textMimeTypes),
	}),
]);

export const awsFormdataSchema = z.object({
	key: z.string(),
	AWSAccessKeyId: z.string(),
	acl: z.string(),
	policy: z.string(),
	signature: z.string(),
	'Content-Type': fileSchema,
	success_action_status: z.literal('200'),
	file: fileSchema,
});

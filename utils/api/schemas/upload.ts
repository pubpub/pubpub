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

export const uploadSchema = z.object({
	name: z.string().optional().openapi({
		description:
			'Name of the file being uploaded. Only strictly necessary if you upload files without proper file information (e.g. from a buffer). \nMake sure you include the file name before the file in the formdata, fields included after the file field are ignored.',
	}),
	file: z.custom<Blob | File>(),
});

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
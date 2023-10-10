import { z } from 'zod';

/**
 * Non-exhaustive list of mime-types that we allow to be uploaded to PubPub,
 * minus image types, which are handled separately.
 */
export const allowedMimeTypes = [
	'application/json',
	'text/yaml',
	'application/xml',
	'application/mods+xml',
	'application/x-research-info-systems',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/epub+zip',
	'text/html',
	'text/markdown',
	'application/vnd.oasis.opendocument.text',
	'text/plain',
	'application/x-tex',
	'application/pdf',
	'text/tex-x',
] as const;

const fileSchema = z.union([z.string(), z.instanceof(Blob)]);

const mimeTypeSchema = z.union([z.enum(allowedMimeTypes), z.string().regex(/image\/.*/)]);

export const uploadSchema = z.object({
	file: fileSchema,
	fileName: z.string(),
	mimeType: mimeTypeSchema,
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

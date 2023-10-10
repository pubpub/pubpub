import { z } from 'zod';
import { extensionToPandocFormat, bibliographyFormats } from 'utils/import/formats';

export const allowedMimeTypes = [
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/json',
	'image/png',
	'image/jpeg',
	'image/gif',
	'text/tex-x',
	'text/html',
	'text/plain',
] as const;

const fileSchema = z.union([z.string(), z.instanceof(Blob), z.instanceof(Buffer)]);
const mimeTypeSchema = z.enum(allowedMimeTypes);

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

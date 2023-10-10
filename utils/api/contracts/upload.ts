import { z } from 'zod';
import { AppRoute } from '@ts-rest/core';
import { uploadSchema } from '../schemas/upload';

export const uploadRoute = {
	path: '/api/upload',
	method: 'POST',
	description: 'Upload a file to PubPub',
	summary: 'Upload a file',
	body: uploadSchema,
	contentType: 'multipart/form-data',
	responses: {
		201: z.object({
			url: z.string(),
			size: z.number(),
			key: z.string(),
		}),
	},
} satisfies AppRoute;

import { z } from 'zod';
import { AppRoute } from '@ts-rest/core';
import { uploadSchema } from '../schemas/upload';

export const uploadRoute = {
	path: '/api/upload',
	method: 'POST',
	summary: 'Upload a file',
	description:
		'Upload a file to PubPub.\n Make sure you include the file _last_ in the formdata, fields included after the file field are ignored.\n\nYou can forgo explictly passing the filename and mimetype if you upload a file with proper file information.',
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

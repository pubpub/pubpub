import type { AppRouteOptions } from '@ts-rest/express';

import { contract } from 'utils/api/contract';
import { generateHash } from 'utils/hashes';
import uuid from 'uuid';

import { createPubPubS3Client } from 'server/utils/s3';
import busboyC from 'busboy';
import mime from 'mime-types';
import { BadRequestError, ForbiddenError } from 'server/utils/errors';
import { isCommunityAdmin } from 'server/community/queries';
import { mimeTypeSchema } from 'utils/api/schemas/upload';

export const generateFileNameForUpload = (file: string) => {
	const folderName = generateHash(8);
	const extension = file !== undefined ? file.split('.').pop() : 'jpg';
	const random = Math.floor(Math.random() * 8);
	const now = new Date().getTime();
	return `${folderName}/${random}${now}.${extension}`;
};

/**
 * This is here because the default test enviroment does not have the AWS keys set.
 * Only runs if you are integration testing
 */
if (
	process.env.NODE_ENV === 'test' &&
	(!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)
) {
	// eslint-disable global-require
	require('../../config');
}

const s3Client = createPubPubS3Client({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	bucket: 'assets.pubpub.org',
	ACL: 'public-read',
});

export const uploadRouteImplementation: AppRouteOptions<typeof contract.upload> = {
	handler: async ({ req }) => {
		const [isAdmin] = await isCommunityAdmin(req);

		if (!isAdmin) {
			throw new ForbiddenError();
		}

		const busboy = busboyC({ headers: req.headers });

		const result: Promise<{ url: string; key: string; size: number }> = new Promise(
			(resolve, reject) => {
				let name: string | undefined;

				busboy.on('field', (fieldname, value) => {
					if (fieldname !== 'name') {
						reject(
							new Error(
								`Unknown field '${fieldname}': '${value}' found. Do not include other data with the form.`,
							),
						);
					}

					name = value;
				});

				busboy.on('file', async (fieldname, file, { filename, mimeType }) => {
					filename = name ?? filename;

					const isDefaultMimeType = mimeType === 'application/octet-stream' || !mimeType;

					const isDefaultFileName = filename === 'blob' || !filename;

					if (!filename && !name) {
						reject(
							new Error(
								'Could not find filename! Check to see whether you included it before the file in the formdata, fields included after the file field are ignored.',
							),
						);
					}

					// if no filenname is given, e.g. when you send up the result of fs.readFileSync, we need to try to guess the file extension
					// this does not really affect the upload, but otherwise we get a default '.png' extension, which is not great
					if (isDefaultMimeType && isDefaultFileName) {
						const inferredMime = mime.contentType(filename);
						mimeType = inferredMime || 'application/octet-stream';
					}

					if (!isDefaultMimeType && isDefaultFileName) {
						filename = `${uuid()}.${mime.extension(mimeType)}`;
					}

					/**
					 * Do manual mimetype parsing, since ts-rest middelware cannot catch it
					 */
					if (!isDefaultMimeType) {
						try {
							mimeTypeSchema.parse(mimeType);
						} catch (err: any) {
							reject(err);
						}
					}

					const key = generateFileNameForUpload(filename);

					let size = 0;
					await s3Client.uploadFileSplit(key, file, {
						contentType: mimeType === 'application/octet-stream' ? undefined : mimeType,
						progressCallback: (progress) => {
							size = progress.loaded ?? 0;
						},
					});

					resolve({ url: `https://assets.pubpub.org/${key}`, size, key });
				});
			},
		);

		req.pipe(busboy);
		try {
			const bod = await result;

			return {
				status: 201,
				body: bod,
			};
		} catch (err: any) {
			throw new BadRequestError(err);
		}
	},
};

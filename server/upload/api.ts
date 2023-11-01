import type { AppRouteOptions } from '@ts-rest/express';

import { contract } from 'utils/api/contract';
import { generateHash } from 'utils/hashes';
import uuid from 'uuid';

import { createPubPubS3Client } from 'server/utils/s3';
import busboyC from 'busboy';
import mime from 'mime-types';
import { BadRequestError } from 'server/utils/errors';
import { mimeTypeSchema } from 'utils/api/schemas/upload';
import { ensureUserIsCommunityAdmin } from 'utils/ensureUserIsCommunityAdmin';

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
	// eslint-disable-next-line global-require
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
		await ensureUserIsCommunityAdmin(req);

		const busboy = busboyC({ headers: req.headers });

		const result: Promise<{ url: string; key: string; size: number }> = new Promise(
			(resolve, reject) => {
				let name: string | undefined;
				let mimeType: string | undefined;

				busboy.on('field', (fieldname, value) => {
					switch (fieldname) {
						case 'name':
							name = value;
							break;
						case 'mimeType':
							mimeType = value;
							break;
						default:
							reject(
								new Error(
									`Unknown field '${fieldname}': '${value}' found. Do not include other data with the form.`,
								),
							);
					}
				});

				busboy.on('file', async (fieldname, file, { filename, mimeType: fileMimeType }) => {
					filename = name ?? filename;
					fileMimeType = mimeType ?? fileMimeType;

					const isDefaultMimeType =
						fileMimeType === 'application/octet-stream' || !fileMimeType;

					const isDefaultFileName = filename === 'blob' || !filename;

					if (!filename && !name) {
						reject(
							new Error(
								'Could not find filename! Check to see whether you included it before the file in the formdata _before_ the file, fields included after the file field are ignored.',
							),
						);
					}

					// if no filenname is given, e.g. when you send up the result of fs.readFileSync, we need to try to guess the file extension
					// this does not really affect the upload, but otherwise we get a default '.png' extension, which is not great
					if (isDefaultMimeType && isDefaultFileName) {
						const inferredMime = mime.contentType(filename);
						fileMimeType = inferredMime || 'application/octet-stream';
					}

					if (!isDefaultMimeType && isDefaultFileName) {
						filename = `${uuid()}.${mime.extension(fileMimeType)}`;
					}

					/**
					 * Do manual mimetype parsing, since ts-rest middelware cannot catch it
					 */
					if (!isDefaultMimeType) {
						try {
							mimeTypeSchema.parse(fileMimeType);
						} catch (err: any) {
							reject(err);
						}
					}

					const key = generateFileNameForUpload(filename);

					let size = 0;
					await s3Client.uploadFileSplit(key, file, {
						contentType:
							fileMimeType === 'application/octet-stream' ? undefined : fileMimeType,
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

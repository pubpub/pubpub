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

const isDefaultMimeType = (mimeType: string | undefined): boolean =>
	mimeType === 'application/octet-stream' || !mimeType;

const defaultFilenames = ['blob', 'file'] as const;

const isDefaultFileName = (name: string | undefined): boolean =>
	defaultFilenames.some((defaultName) => name === defaultName) || !name;

const inferMimeTypeFromFileName = (filename: string | undefined): string => {
	if (!filename) {
		return 'application/octet-stream';
	}
	const inferredMime = mime.lookup(filename);
	return inferredMime || 'application/octet-stream';
};

const generateFileNameFromMimeType = (mimeType: string): string =>
	`${uuid()}.${mime.extension(mimeType)}`;

const validateMimeType = (mimeType: string): void => {
	try {
		mimeTypeSchema.parse(mimeType);
	} catch (err: any) {
		console.log(err);
		throw new BadRequestError(new Error(`Invalid mime type: ${mimeType}`));
	}
};

const validateFileNameAndMimeType = ({
	filename,
	mimeType,
}: {
	filename?: string;
	mimeType?: string;
}): { filename: string; mimeType: string } => {
	switch (true) {
		/**
		 * no filename or mimetype provided, exit
		 */
		case isDefaultMimeType(mimeType) && isDefaultFileName(filename): {
			throw new BadRequestError(new Error('No filename or mimetype provided'));
		}
		/**
		 * no mimetype provided, infer from filename
		 */
		case isDefaultMimeType(mimeType) && !isDefaultFileName(filename): {
			mimeType = inferMimeTypeFromFileName(filename);
			break;
		}
		/**
		 * mimetype provided, no filename provided, generate filename from mimetype
		 */
		case !isDefaultMimeType(mimeType) && isDefaultFileName(filename): {
			filename = generateFileNameFromMimeType(mimeType as string);
			break;
		}
		/**
		 * both mimetype and filename provided, do nothing
		 */
		default:
			break;
	}

	validateMimeType(mimeType as string);

	return { filename: filename as string, mimeType: mimeType as string };
};

export const uploadRouteImplementation: AppRouteOptions<typeof contract.upload> = {
	handler: async ({ req }) => {
		await ensureUserIsCommunityAdmin(req);

		const busboy = busboyC({ headers: req.headers });

		const result: Promise<{ url: string; key: string; size: number }> = new Promise(
			(resolve, reject) => {
				let explicitlyPassedFilename: string | undefined;
				let explicitlyPassedMimeType: string | undefined;

				busboy.on('field', (fieldname, value) => {
					switch (fieldname) {
						case 'name':
							explicitlyPassedFilename = value;
							break;
						case 'mimeType':
							explicitlyPassedMimeType = value;
							break;
						default:
							reject(
								new Error(
									`Unknown field '${fieldname}': '${value}' found. Do not include other data with the form.`,
								),
							);
					}
				});

				busboy.on(
					'file',
					async (
						fieldname,
						file,
						{ filename: filenameFromFile, mimeType: mimeTypeFromFile },
					) => {
						try {
							const { filename, mimeType } = validateFileNameAndMimeType({
								filename: explicitlyPassedFilename ?? filenameFromFile,
								mimeType: explicitlyPassedMimeType ?? mimeTypeFromFile,
							});

							const key = generateFileNameForUpload(filename);

							let size = 0;
							await s3Client.uploadFileSplit(key, file, {
								contentType:
									mimeType === 'application/octet-stream' ? undefined : mimeType,
								progressCallback: (progress) => {
									size = progress.loaded ?? 0;
								},
							});

							resolve({ url: `https://assets.pubpub.org/${key}`, size, key });
						} catch (err: any) {
							reject(err);
						}
					},
				);
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

import type { AppRouteOptions } from '@ts-rest/express';

import { contract } from 'utils/api/contract';
import { generateHash } from 'utils/hashes';
import uuid from 'uuid';

import { createPubPubS3Client } from 'server/utils/s3';
import busboyC from 'busboy';
import mime from 'mime-types';
import fileType from 'file-type';
import { BadRequestError } from 'server/utils/errors';

export const generateFileNameForUpload = (file: string) => {
	const folderName = generateHash(8);
	const extension = file !== undefined ? file.split('.').pop() : 'jpg';
	const random = Math.floor(Math.random() * 8);
	const now = new Date().getTime();
	return `${folderName}/${random}${now}.${extension}`;
};

type UploadBody = (typeof contract.upload.body)['_output'];

// const getBaseUrlForBucket = (bucket: string) => `https://s3-external-1.amazonaws.com/${bucket}`;

const isStringUpload = (body: UploadBody): body is Extract<UploadBody, { file: string }> =>
	typeof body.file === 'string';

// const getFileParams = async (body: (typeof contract.upload.body)['_output']) => {
// 	if (isStringUpload(body)) {
// 		const newFile = new Blob([body.file], {
// 			type: body.mimeType,
// 		});
// 		return {
// 			file: newFile,
// 			fileName: body.fileName,
// 			mimeType: body.mimeType,
// 			size: newFile.size,
// 		};
// 	}

// 	const { file, fileName, mimeType } = body;
// 	const buffer = file.buffer;

// 	let fileType: FileTypeResult | undefined;
// 	if (!mimeType && (!file.mimetype || file.mimetype === 'application/octet-stream')) {
// 		fileType = await fromBuffer(buffer);
// 	}
// 	const mime = mimeType ?? file.mimetype ?? fileType?.mime ?? '';
// 	const name =
// 		fileName ?? file.originalname ?? (fileType?.ext ? `${uuid()}.${fileType.ext}` : uuid());

// 	return {
// 		fileName: name,
// 		mimeType: mime,
// 		size: file.size,
// 		file: new Blob([file.buffer], {
// 			type: file.mimetype,
// 		}),
// 	};
// };

// export const createAWSFormData = async (body: UploadBody) => {
// 	const { file, fileName, mimeType, size } = await getFileParams(body);

// 	const { acl, awsAccessKeyId, policy, signature, bucket } = getUploadPolicy({
// 		contentType: mimeType,
// 	});

// 	const formData = new FormData();

// 	const key = generateFileNameForUpload(fileName);

// 	formData.append('key', key);
// 	formData.append('AWSAccessKeyId', awsAccessKeyId);
// 	formData.append('acl', acl);
// 	formData.append('policy', policy);
// 	formData.append('signature', signature);
// 	formData.append('Content-Type', mimeType);
// 	formData.append('success_action_status', '200');
// 	formData.append('file', file, fileName);

// 	const baseUrl = getBaseUrlForBucket(bucket);
// 	const url = `https://assets.pubpub.org/${key}`;

// 	return { formData, key, baseUrl, size, url };
// };

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
	require('../../config');
}

const s3Client = createPubPubS3Client({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	bucket: 'assets.pubpub.org',
	ACL: 'public-read',
});

export const uploadRouteImplementation: AppRouteOptions<typeof contract.upload> = {
	handler: async ({ req, res, body, file: smile }) => {
		// const [isAdmin] = await isCommunityAdmin(req);

		// if (!isAdmin) {
		// 	throw new ForbiddenError();
		// }

		const busboy = busboyC({ headers: req.headers });
		console.log(body);

		if (isStringUpload(body)) {
			const key = generateFileNameForUpload(body.filename);
			const x = s3Client.uploadFile(
				key,
				new Blob([body.file], {
					type: body.mimeType,
				}),
			);
			return {
				status: 201,
				body: x,
			};
		}

		const x = new Promise((resolve) => {
			let name: string | undefined;

			busboy.on('field', (fieldname, value, info) => {
				console.log(fieldname, value, info);
				if (fieldname !== 'name') {
					throw new BadRequestError(
						new Error(
							`Unknown field '${fieldname}': '${value}' found. Do not include other data with the form.`,
						),
					);
				}

				name = value;
			});

			busboy.on('file', async (fieldname, file, { filename, mimeType }) => {
				console.log({ fieldname, file, filename, mimeType });
				filename = name ?? filename;

				const isDefaultMimeType = mimeType === 'application/octet-stream' || !mimeType;

				const isDefaultFileName = filename === 'blob' || !filename;

				if (!filename && !name) {
					throw new BadRequestError(
						new Error(
							'Could not find filename! Check to see whether you included it before the file in the formdata, fields included after the file field are ignored.',
						),
					);
				}
				console.log('before', filename);
				// if no filenname is given, e.g. when you send up the result of fs.readFileSync, we need to try to guess the file extension
				// this does not really affect the upload, but otherwise we get a default '.png' extension, which is not great
				if (isDefaultMimeType && isDefaultFileName) {
					//					filename = fileTypeResult?.ext ? `${uuid()}.${fileTypeResult.ext}` : `file`;
					//	mimeType = mime.contentType(filename);
					console.log(filename, mimeType);
				}

				if (!isDefaultMimeType && isDefaultFileName) {
					filename = `${uuid()}.${mime.extension(mimeType)}`;
					console.log(filename);
				}

				const key = generateFileNameForUpload(filename);

				let size = 0;
				await s3Client.uploadFileSplit(key, file, {
					contentType: mimeType === 'application/octet-stream' ? undefined : mimeType,
					progressCallback: (progress) => {
						console.log(progress);
						size = progress.loaded ?? 0;
					},
				});
				resolve({ url: `https://assets.pubpub.org/${key}`, size, key });
			});
		});

		req.pipe(busboy);

		const bod = await x;

		return {
			status: 201,
			body: bod,
		};
	},
};

import multer from 'multer';
import type { AppRouteOptions } from '@ts-rest/express';

import { contract } from 'utils/api/contract';
import { getUploadPolicy } from 'server/uploadPolicy/queries';
import { generateHash } from 'utils/hashes';
import { isCommunityAdmin } from 'server/community/queries';
import { ForbiddenError } from 'server/utils/errors';
import { type FileTypeResult, fromBuffer } from 'file-type';
import uuid from 'uuid';

import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

export const generateFileNameForUpload = (file: string) => {
	const folderName = generateHash(8);
	const extension = file !== undefined ? file.split('.').pop() : 'jpg';
	const random = Math.floor(Math.random() * 8);
	const now = new Date().getTime();
	return `${folderName}/${random}${now}.${extension}`;
};

type UploadBody = (typeof contract.upload.body)['_output'];
const getBaseUrlForBucket = (bucket: string) => `https://s3-external-1.amazonaws.com/${bucket}`;

const isStringUpload = (body: UploadBody): body is Extract<UploadBody, { file: string }> =>
	typeof body.file === 'string';

const getFileParams = async (body: (typeof contract.upload.body)['_output']) => {
	if (isStringUpload(body)) {
		const newFile = new Blob([body.file], {
			type: body.mimeType,
		});
		return {
			file: newFile,
			fileName: body.fileName,
			mimeType: body.mimeType,
			size: newFile.size,
		};
	}

	const { file, fileName, mimeType } = body;
	const buffer = file.buffer;

	let fileType: FileTypeResult | undefined;
	if (!mimeType && (!file.mimetype || file.mimetype === 'application/octet-stream')) {
		fileType = await fromBuffer(buffer);
	}
	const mime = mimeType ?? file.mimetype ?? fileType?.mime ?? '';
	const name =
		fileName ?? file.originalname ?? (fileType?.ext ? `${uuid()}.${fileType.ext}` : uuid());

	return {
		fileName: name,
		mimeType: mime,
		size: file.size,
		file: new Blob([file.buffer], {
			type: file.mimetype,
		}),
	};
};

export const createAWSFormData = async (body: UploadBody) => {
	const { file, fileName, mimeType, size } = await getFileParams(body);

	const { acl, awsAccessKeyId, policy, signature, bucket } = getUploadPolicy({
		contentType: mimeType,
	});

	const formData = new FormData();

	const key = generateFileNameForUpload(fileName);

	formData.append('key', key);
	formData.append('AWSAccessKeyId', awsAccessKeyId);
	formData.append('acl', acl);
	formData.append('policy', policy);
	formData.append('signature', signature);
	formData.append('Content-Type', mimeType);
	formData.append('success_action_status', '200');
	formData.append('file', file, fileName);

	const baseUrl = getBaseUrlForBucket(bucket);
	const url = `https://assets.pubpub.org/${key}`;

	return { formData, key, baseUrl, size, url };
};

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
	require('../../config');
}

const s3 = new S3Client({
	region: 'us-east-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

const upload = multer({
	storage: multerS3({
		s3,
		bucket: 'assets.pubpub.org',
		acl: 'public-read',
		contentType: async (req, file, cb) => {
			console.log(file);
			const { mimeType } = req.body;

			let fileType = mimeType ?? file.mimetype ?? '';
			if (!fileType || file.mimetype === 'application/octet-stream') {
				fileType = (await fromBuffer(file.buffer))?.mime;
			}

			console.log({ fileType, mimeType });

			cb(null, fileType);
		},
		metadata: (req, file, cb) => {
			console.log(file);
			cb(null, { fieldName: file.fieldname });
		},
		key: (req, file, cb) => {
			const fileName = req?.body?.fileName ?? file.originalname ?? uuid();

			const key = generateFileNameForUpload(fileName);
			console.log({ key });
			cb(null, key);
		},
	}),
});

export const uploadRouteImplementation: AppRouteOptions<typeof contract.upload> = {
	middleware: [
		async (req, res, next) => {
			const [isAdmin] = await isCommunityAdmin(req);

			if (!isAdmin) {
				throw new ForbiddenError();
			}
			next();
		},
		upload.single('file'),
	],
	handler: async ({ req, body, file }) => {
		console.log({ file, body, req });
		const url = `https://assets.pubpub.org/${file.key}`;
		return {
			status: 201,
			body: {
				url,
				size: file.size,
				key: file.key,
			},
		};
	},
	//	handler: async ({ req, body, file }) => {

	// const [isAdmin] = await isCommunityAdmin(req);

	// if (!isAdmin) {
	// 	throw new ForbiddenError();
	// }
	// console.log({ body, file });

	// const newBody = {
	// 	...body,
	// 	file: file ?? body.file,
	// 	// gotta lie here because file is typed as unknown usually
	// } as UploadBody;

	// const { formData, key, baseUrl, size, url } = await createAWSFormData(newBody);

	// try {
	// 	await fetch(baseUrl, {
	// 		method: 'POST',
	// 		body: formData,
	// 	});

	// 	return {
	// 		status: 201,
	// 		body: {
	// 			url,
	// 			size,
	// 			key,
	// 		},
	// 	};
	// } catch (error) {
	// 	console.error(error);
	// 	throw new Error('Upload failed');
	// }
	// },
};

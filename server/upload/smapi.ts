import multer from 'multer';
import { type FileTypeResult, fromBuffer } from 'file-type';
import busboyC from 'busboy';

import app from 'server/server';
import { createPubPubS3Client } from 'server/utils/s3';
import { generateFileNameForUpload } from './api';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import mime from 'mime-types';
import fileType from 'file-type';
import uuid from 'uuid';

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
	require('../../config');
}

// const s3 = createPubPubS3Client({
// 	accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
// 	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
// 	bucket: 'assets.pubpub.org',
// 	ACL: 'public-read',
// });
const s3 = new S3Client({
	region: 'us-east-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

app.post('/api/smupload', async (req, res) => {
	const busboy = busboyC({ headers: req.headers });

	busboy.on('file', async (fieldname, file, { filename, encoding, mimeType }) => {
		console.log({ filename, encoding, mimeType, fieldname });

		const isDefaultMimeType = mimeType === 'application/octet-stream' || !mimeType;

		// if no filenname is given, e.g. when you send up the result of fs.readFileSync, we need to try to guess the file extension
		// this does not really affect the upload, but otherwise we get a default '.png' extension, which is not great
		if (isDefaultMimeType && !filename) {
			const fileTypeResult = await fileType.fromStream(file);
			filename = fileTypeResult?.ext ? `${uuid()}.${fileTypeResult.ext}` : `file`;
		}

		if (!isDefaultMimeType && !filename) {
			filename = `${uuid()}.${mime.extension(mimeType)}`;
		}

		const key = generateFileNameForUpload(filename);

		const parallelUploads3 = new Upload({
			client: s3,
			params: {
				Bucket: 'assets.pubpub.org',
				Key: key,
				Body: file,
				ACL: 'public-read',
				ContentType: mimeType,
			},
			queueSize: 3, // optional concurrency configuration
			partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
			leavePartsOnError: false, // optional manually handle dropped parts
		});

		parallelUploads3.on('httpUploadProgress', (progress) => {
			console.log(progress);
		});

		await parallelUploads3.done();

		res.status(201).json({ url: `https://assets.pubpub.org/${key}` });
		// s3.uploadFile(key, file, false, size)
		// 	.then((result) => {
		// 		res.json({
		// 			success: true,
		// 		});
		// 	})
		// 	.catch((err) => {
		// 		console.log('downies');
		// 		console.log(err);
		// 		res.status(500).send({ error: err });
		// 	});
	});

	// busboy.on('finish', function () {
	// 	console.log('Done parsing form!');
	// 	res.status(201);
	// });
	req.pipe(busboy);
});

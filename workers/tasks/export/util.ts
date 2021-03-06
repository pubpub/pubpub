import fs from 'fs';
import AWS from 'aws-sdk';
import tmp from 'tmp-promise';
import crypto from 'crypto';

import { Export } from 'server/models';
import { generateHash } from 'utils/hashes';

tmp.setGracefulCleanup();

AWS.config.setPromisesDependency(Promise);
const s3bucket = new AWS.S3({ params: { Bucket: 'assets.pubpub.org' } });

export const uploadDocument = (pubId, tmpFile, extension) => {
	const readableStream = fs.createReadStream(tmpFile.path);
	const key = `${generateHash(8)}/${pubId}.${extension}`;
	const params = {
		Key: key,
		Body: readableStream,
		ACL: 'public-read',
	};
	return new Promise((resolve, reject) => {
		// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
		s3bucket.upload(params, (err) => {
			if (err) {
				reject(err);
			}
			resolve(`https://assets.pubpub.org/${key}`);
		});
	});
};

export const getTmpFileForExtension = (extension) => tmp.file({ postfix: `.${extension}` });

export const writeToFile = (html, file) => {
	return new Promise((resolve, reject) => {
		// @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(err: any, res: any) => void' is... Remove this comment to see the full error message
		fs.writeFile(file.path, html, {}, (err, res) => {
			if (err) {
				return reject(err);
			}
			return resolve(res);
		});
	});
};

export const getExportById = (exportId) => Export.findOne({ where: { id: exportId } });

export const assignFileToExportById = (exportId, fileUrl) =>
	Export.update({ url: fileUrl }, { where: { id: exportId } });

export const digestCitation = (unstructuredValue, structuredValue) =>
	crypto
		.createHash('md5')
		.update(unstructuredValue)
		.update(structuredValue)
		.digest('base64')
		.substring(0, 10);

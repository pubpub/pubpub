import { contract } from 'utils/api/contract';

import { AppRouteImplementation } from '@ts-rest/express';
import { getUploadPolicy } from 'server/uploadPolicy/queries';
import { generateHash } from 'utils/hashes';
import { isCommunityAdmin } from 'server/community/queries';
import { ForbiddenError } from 'server/utils/errors';

export const generateFileNameForUpload = (file: string) => {
	const folderName = generateHash(8);
	const extension = file !== undefined ? file.split('.').pop() : 'jpg';
	const random = Math.floor(Math.random() * 8);
	const now = new Date().getTime();
	return `${folderName}/${random}${now}.${extension}`;
};

const getBaseUrlForBucket = (bucket: string) => `https://s3-external-1.amazonaws.com/${bucket}`;

export const createAWSFormData = (body: (typeof contract.upload.body)['_output']) => {
	const { mimeType, file, fileName } = body;

	const res =
		typeof file === 'string'
			? new Blob([file], {
					type: mimeType,
			  })
			: file;

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
	formData.append('file', res, fileName);

	const baseUrl = getBaseUrlForBucket(bucket);
	const url = `https://assets.pubpub.org/${key}`;

	return { formData, key, baseUrl, size: res.size, url };
};

export const uploadRouteImplementation: AppRouteImplementation<typeof contract.upload> = async ({
	req,
	body,
	file,
}) => {
	const [isAdmin] = await isCommunityAdmin(req);

	if (!isAdmin) {
		throw new ForbiddenError();
	}

	const { formData, key, baseUrl, size, url } = createAWSFormData(body);

	try {
		await fetch(baseUrl, {
			method: 'POST',
			body: formData,
		});

		return {
			status: 201,
			body: {
				url,
				size,
				key,
			},
		};
	} catch (error) {
		console.error(error);
		throw new Error('Upload failed');
	}
};

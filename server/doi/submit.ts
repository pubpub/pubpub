import { DepositTarget } from 'server/models';
import { Readable } from 'stream';
import request from 'request-promise';
import xmlbuilder from 'xmlbuilder';

const getDoiLogin = async (communityId) => {
	const doiOverride = await DepositTarget.findOne({
		where: { communityId, service: 'crossref' },
	});
	if (doiOverride) {
		const { username, password } = doiOverride;
		return {
			login: username,
			password: password,
		};
	}
	return {
		login: process.env.DOI_LOGIN_ID,
		password: process.env.DOI_LOGIN_PASSWORD,
	};
};

export const submitDoiData = async (json, timestamp, communityId) => {
	const { DOI_SUBMISSION_URL } = process.env;
	const { login, password } = await getDoiLogin(communityId);
	const xmlObject = xmlbuilder.create(json, { headless: true }).end({ pretty: true });
	const readStream = new Readable();
	// eslint-disable-next-line no-underscore-dangle
	readStream._read = function noop() {};
	readStream.push(xmlObject);
	readStream.push(null);
	// @ts-expect-error ts-migrate(2339) FIXME: Property 'path' does not exist on type 'Readable'.
	readStream.path = `/${timestamp}.xml`;
	return request({
		method: 'POST',
		url: DOI_SUBMISSION_URL,
		formData: {
			login_id: login,
			login_passwd: password,
			fname: readStream,
		},
		headers: {
			'content-type': 'multipart/form-data',
			'user-agent': 'PubPub (mailto:hello@pubpub.org)',
		},
	});
};

import { login, modelize, setup, teardown } from 'stubstub';
// this file is not under tsconfig.test.json, so it doesn't get the types, so we import them manually
import { describe, expect, it, beforeEach, beforeAll, afterAll } from '@jest/globals';

const models = modelize`
	Community community {
		Member {
			permissions: "admin"
			User admin {}
		}
		Member {
			permissions: "view"
			User nonAdmin {}
		}
    }`;

// we require config.js here in order to get proper AWS_ACCESS_ID env vars
// eslint-disable-next-line global-require
require('../../../config');

setup(beforeAll, async () => {
	await models.resolve();
});

teardown(afterAll);

const getHost = (community: any) => `${community.subdomain}.pubpub.org`;

let adminAgent: Awaited<ReturnType<typeof login>>;
describe('POST /api/upload', () => {
	beforeEach(async () => {
		adminAgent = await login(models.admin);
		adminAgent.set('Host', getHost(models.community));
	});

	it('should not be able to upload if not logged in', async () => {
		const agent = await login();
		await agent
			.post('/api/upload')
			.send({
				file: 'test file',
				fileName: 'test file name.html',
				mimeType: 'text/html',
			})
			.expect(403);
	});

	it('should be able to upload a text html file', async () => {
		const testContent = 'test file';
		const result = await adminAgent
			.post('/api/upload')
			.send({
				file: testContent,
				fileName: 'test file name.html',
				mimeType: 'text/html',
			})
			.expect(201);

		const res = await fetch(result.body.url);

		expect(res.status).toEqual(200);

		const body = await res.text();

		expect(body).toEqual('test file');
	});
});

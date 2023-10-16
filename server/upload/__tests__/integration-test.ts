import { login, modelize, setup, teardown } from 'stubstub';
// this file is not under tsconfig.test.json, so it doesn't get the types, so we import them manually
import { describe, expect, it, beforeEach, beforeAll, afterAll } from '@jest/globals';
import path from 'path';
import fs from 'fs/promises';

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

	// it('should not be able to upload if not logged in', async () => {
	// 	const agent = await login();
	// 	await agent
	// 		.post('/api/upload')
	// 		.send({
	// 			file: 'test file',
	// 			fileName: 'test file name.html',
	// 			mimeType: 'text/html',
	// 		})
	// 		.expect(403);
	// });

	it('should be able to upload a text html file', async () => {
		const testContent = 'test file';
		const result = await adminAgent
			.post('/api/upload')
			.attach('file', Buffer.from(testContent), {
				filename: 'test file name.html',
			})
			.field('name', 'test file name.html')
			.expect(201);
	});

	// 	const res = await fetch(result.body.url);

	// 	expect(res.status).toEqual(200);

	// 	const body = await res.text();

	// 	expect(body).toEqual('test file');
	// });

	// it('should be able to upload a text html buffer with properly set filename and content type using formdata', async () => {
	// 	const testContent = 'test file';

	// 	const result = await adminAgent
	// 		.post('/api/smupload')
	// 		.attach('file', Buffer.from(testContent), {
	// 			filename: 'test file name.html',
	// 			contentType: 'text/html',
	// 		})
	// 		.expect(201);

	// 	const res = await fetch(result.body.url);

	// 	expect(res.status).toEqual(200);

	// 	const body = await res.text();

	// 	expect(body).toEqual('test file');
	// });

	// it('should be able to upload a BIG PDF file read from disk', async () => {
	// 	const pdfFile = path.join(__dirname, 'test.pdf');
	// 	const pdfFileContent = await fs.readFile(pdfFile);

	// 	console.log(pdfFileContent.byteLength);
	// 	const formdata = new FormData();
	// 	const port = adminAgent.app.address().port;
	// 	formdata.append('name', 'test.pdf');
	// 	formdata.append('file', new Blob([pdfFileContent]));

	// 	const result = await fetch(`http://localhost:${port}/api/upload`, {
	// 		method: 'POST',
	// 		body: formdata,
	// 	});

	// 	expect(result.status).toEqual(201);

	// 	// const result = await adminAgent
	// 	// 	.post('/api/upload')
	// 	// 	.attach('file', pdfFileContent, {
	// 	// 		filename: 'test file name.pdf',
	// 	// 		contentType: 'application/pdf',
	// 	// 	})
	// 	// 	.expect(201);
	// 	const body = await result.json();

	// 	console.log(body);
	// 	expect(body.size).toBeGreaterThan(20_000_000);
	// 	const res = await fetch(body.url, { method: 'HEAD' });

	// 	expect(res.status).toEqual(200);
	// }, 60000);
});

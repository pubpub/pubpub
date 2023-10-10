import { uploadSchema, awsFormdataSchema } from 'utils/api/schemas/upload';
import { createAWSFormData } from '../api';

const html = String.raw;

describe('/api/upload unit tests', () => {
	it('should produce valid AWS form data', () => {
		const body = uploadSchema.parse({
			file: html`<html>
				<body>
					<h1>Test</h1>
				</body>
			</html>`,
			fileName: 'test.html',
			mimeType: 'text/html',
		});

		const { formData, size, url } = createAWSFormData(body);

		const formDataJson = Object.fromEntries(formData);

		const form = awsFormdataSchema.safeParse(formDataJson);

		expect(form.success).toEqual(true);
		expect(url).toMatch(/https:\/\/assets.pubpub.org\/.*?\/.*/);
		expect(size).toBeGreaterThanOrEqual(56);
	});
});

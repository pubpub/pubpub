import app from 'server/server';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

import { isDuqDuq, isProd } from 'utils/environment';
import { validate } from 'utils/api';

extendZodWithOpenApi(z);

app.get(
	'/api/logout',
	validate({
		description: 'Logout',
		summary: 'Logout and clear authentication cookie',
		tags: ['Login'],
		response: z.literal('success').openapi({
			description: `Successfully logged out.\n The sesion ID is cleared from the cookie named \`connect.sid\`, and future requests will not be authenticated.`,
		}),
	}),
	(req, res) => {
		res.cookie('gdpr-consent-survives-login', 'no');
		res.cookie('pp-cache', 'pp-cache', {
			...(isProd() && req.hostname.indexOf('pubpub.org') > -1 && { domain: '.pubpub.org' }),
			...(isDuqDuq() && req.hostname.indexOf('pubpub.org') > -1 && { domain: '.duqduq.org' }),
		});
		req.logout();
		return res.status(200).json('success');
	},
);

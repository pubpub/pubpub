import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

import { isDuqDuq, isProd } from 'utils/environment';
import { AppRouteImplementation } from '@ts-rest/express';
import { contract } from 'utils/api/contract';

extendZodWithOpenApi(z);

export const logout: AppRouteImplementation<typeof contract.logout> = async ({ req, res }) => {
	console.log('AAAA');
	res.cookie('gdpr-consent-survives-login', 'no');
	res.cookie('pp-cache', 'pp-cache', {
		...(isProd() && req.hostname.indexOf('pubpub.org') > -1 && { domain: '.pubpub.org' }),
		...(isDuqDuq() && req.hostname.indexOf('pubpub.org') > -1 && { domain: '.duqduq.org' }),
	});
	req.logout();
	return { status: 200, body: 'success' } as const;
};

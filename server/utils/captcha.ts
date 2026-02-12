import { verifySolution } from 'altcha-lib';

import { isProd } from 'utils/environment';

const DEV_HMAC_KEY = 'dev-altcha-hmac-key-do-not-use-in-production';

export const getAltchaHmacKey = (): string => {
	const key = process.env.ALTCHA_HMAC_KEY;
	if (isProd() && !key) {
		throw new Error('ALTCHA_HMAC_KEY must be set in production');
	}
	return key ?? DEV_HMAC_KEY;
};

export const verifyCaptchaPayload = async (payload: string): Promise<boolean> => {
	console.log('payload', payload);
	if (!payload || typeof payload !== 'string') return false;
	const hmacKey = getAltchaHmacKey();
	console.log('hmacKey', hmacKey);
	return verifySolution(payload, hmacKey);
};

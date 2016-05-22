import request from 'superagent';

export function checkCaptcha({token, remoteip}) {

	const key = process.env.CAPTCHA_KEY || require('../config').captchaKey;
	return new Promise(function(resolve, reject) {

		if (!key) {
			console.warn('No captcha key included so captcha was not checked.');
			resolve();
		}

		request
		.post('https://www.google.com/recaptcha/api/siteverify')
		.query({
			secret: key,
			response: token,
			remoteip: remoteip
		})
		.set('Accept', 'application/json')
		.end(function(recError, recResponse) {

			if (recError || !recResponse || !recResponse.body) {
				reject();
				return;
			}

			const success = recResponse.body.success;
			const errorCodes = recResponse.body['error-codes'];

			if (!success) {
				reject(errorCodes);
			}
			resolve();
		});

	});
}

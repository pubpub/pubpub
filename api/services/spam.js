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

/** Function count the occurrences of substring in a string;
 * @param {String} string   Required. The string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}


export function checkSpam(markdown) {

	const cleanedString = markdown.replace(/[^a-zA-Z0-9! ]+/g, "");
	let foundWords = 0;

	const hardspamwords = ['stream', 'watch', 'online', 'live', 'free', 'episode'];

	for (const spamWord of hardspamwords) {
		foundWords += occurrences(cleanedString, spamWord);
	}
	if (foundWords >= 4) {
		return true;
	}
	return false;
}

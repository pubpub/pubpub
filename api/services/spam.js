import request from 'superagent';
import words from 'lodash/words';

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

	const newString = string + '';
	const newSubString = subString + '';
	if (subString.length <= 0) return (newString.length + 1);

	let index = 0;
	let pos = 0;
	const step = allowOverlapping ? 1 : newSubString.length;

	while (true) {
		pos = newString.indexOf(newSubString, pos);
		if (pos >= 0) {
			++index;
			pos += step;
		} else break;
	}
	return index;
}


export function checkSpam(markdown) {

	const cleanedString = markdown.replace(/[^a-zA-Z0-9! ]+/g, '').toLowerCase();
	let foundWords = 0;
	let uniqueWords = 0;
	const wordCount = words(cleanedString).length;

	const hardspamwords = ['stream', 'watch', 'online', 'live', 'free', 'episode', 'thrones'];

	for (const spamWord of hardspamwords) {
		const spamWordCount = occurrences(cleanedString, spamWord);
		foundWords += spamWordCount;
		if (spamWordCount > 1) {
			uniqueWords++;
		}
	}

	if (uniqueWords >= 2 && foundWords >= (3 + Math.round(wordCount / 100)) ) {
		return true;
	}
	return false;
}

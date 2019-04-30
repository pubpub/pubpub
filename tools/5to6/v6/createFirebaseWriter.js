const { google } = require('googleapis');
const request = require('request');

const secrets = require('../secrets');

const GOOGLE_SCOPES = [
	'https://www.googleapis.com/auth/userinfo.email',
	'https://www.googleapis.com/auth/firebase.database',
];

const createWriterForToken = (accessToken) => (pubId, jsonBody) =>
	new Promise((resolve, reject) => {
		const url = `${secrets.v6FirebaseUrl}/pub-${pubId}.json`;
		request(
			url,
			{
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-type': 'text/json',
				},
				body: JSON.stringify(jsonBody),
			},
			(error, response, body) => {
				if (error) {
					reject(error);
				} else if (response.statusCode >= 200 && response.statusCode <= 299) {
					resolve();
				} else {
					reject(new Error(`Got status ${response.statusCode}: ${body}`));
				}
			},
		);
	});

const createFirebaseWriter = () =>
	new Promise((resolve, reject) => {
		const serviceAccount = JSON.parse(
			Buffer.from(secrets.v6FirebaseServiceAccount, 'base64').toString(),
		);
		const jwtClient = new google.auth.JWT(
			serviceAccount.client_email,
			null,
			serviceAccount.private_key,
			GOOGLE_SCOPES,
		);
		// Use the JWT client to generate an access token.
		jwtClient.authorize(function(error, tokens) {
			if (error) {
				reject(error);
			} else if (tokens.access_token === null) {
				reject(
					new Error(
						'Provided service account does not have permission to generate access tokens',
					),
				);
			} else {
				resolve(createWriterForToken(tokens.access_token));
			}
		});
	});

module.exports = createFirebaseWriter;

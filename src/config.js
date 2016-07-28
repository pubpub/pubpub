require('babel-polyfill');

// const env = (process.env.NODE_ENV === 'production' && location.hostname !== 'pubpub-dev.herokuapp.com') ? 'production' : 'development';
const heroku = (process.env.NODE_ENV === 'production');
const env = (heroku) ? 'production' : 'development';

const environment = {
	development: {
		isProduction: false,
		collabServerUrl: 'james.pubpub.org',
	},
	production: {
		isProduction: true,
		collabServerUrl: 'james.pubpub.org',
	}
}[env];


module.exports = Object.assign({
	port: process.env.PORT,
	apiPort: process.env.APIPORT,
	env: env,
	app: {
		title: 'PubPub',
		description: '',
		meta: {
			charSet: 'utf-8',
		}
	}
}, environment);

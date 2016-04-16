require('babel-polyfill');

// const env = (process.env.NODE_ENV === 'production' && location.hostname !== 'pubpub-dev.herokuapp.com') ? 'production' : 'development';
const heroku = (process.env.NODE_ENV === 'production');
const env = (heroku) ? 'production' : 'development';

const environment = {
	development: {
		isProduction: false,
		FireBaseURL: 'https://pubpub-dev.firebaseio.com/',
		// FireBaseURL: process.env.FIREBASE_URL || 'https://pubpub-migration.firebaseio.com/',
	},
	production: {
		isProduction: true,
		FireBaseURL: process.env.FIREBASE_URL || 'https://pubpub.firebaseio.com/'
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

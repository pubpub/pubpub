require('babel-polyfill');


const env = (process.env.NODE_ENV === 'production' && location.hostname !== 'pubpub-dev.herokuapp.com') ? 'production' : 'development';

const environment = {
	development: {
		isProduction: false,
		// FireBaseURL: 'https://pubpub-dev.firebaseio.com/',
		FireBaseURL: 'https://pubpub-migration.firebaseio.com/',
	},
	production: {
		isProduction: true,
		FireBaseURL: 'https://pubpub.firebaseio.com/'
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

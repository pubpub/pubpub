const firebaseAdmin = require('firebase-admin');

const { getFirebaseConfig, storage } = require('../setup');
const secrets = require('../secrets');
const processPub = require('./processPub');

const pubIds = ['00f9aaaf-0468-4590-9b86-1a2bff4ffe57'];

const getFirebaseRef = () => {
	const serviceAccount = JSON.parse(
		Buffer.from(secrets.v6FirebaseServiceAccount, 'base64').toString(),
	);
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert(serviceAccount),
		databaseURL: getFirebaseConfig().databaseURL,
	});
	const db = firebaseAdmin.database();
	return db.ref('/');
};

const main = () => {
	const firebaseRef = getFirebaseRef();
	pubIds.forEach(async (pubId) => {
		await processPub(storage, firebaseRef, pubId);
	});
};

main();

const firebaseSecret = process.env.NODE_ENV !== 'production' ? require('../authentication/firebaseCredentials').firebaseSecret : process.env.FIREBASE_SECRET;
const FirebaseTokenGenerator = require("firebase-token-generator");

export function firebaseTokenGen(username, pubSlug) {
	const tokenGenerator = new FirebaseTokenGenerator(firebaseSecret);
	return tokenGenerator.createToken({ uid: username, pubSlug: pubSlug });
};

export function generateAuthToken() {
	return firebaseSecret;
};

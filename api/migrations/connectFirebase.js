const FirebaseSecret = require('../authentication/firebaseCredentials').prodTestFirebaseSecret;
const Firebase = require('firebase');
const Firepad = require('firepad');

export function connectFirebase(cb) {
	var ref = new Firebase('https://pubpub-migration.firebaseio.com/');
	// Production Secret
	ref.authWithCustomToken(FirebaseSecret, function() {
		cb(ref);
	});
}

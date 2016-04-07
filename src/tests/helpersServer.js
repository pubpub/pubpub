const mongoose = require('mongoose');

export function clearDB() {
	for (const index in mongoose.connection.collections) {
		if (mongoose.connection.collections.hasOwnProperty(index)) {
			mongoose.connection.collections[index].remove(function() {});
		}

	}
}

export function beforeEachMongoose(done) {
	const dbURI = 'mongodb://localhost:27017/pubpub_test';

	if (mongoose.connection.readyState === 0) {
		mongoose.connect(dbURI, function(err) {
			if (err) {
				throw err;
			}
			clearDB();
			return done();
		});
	} else {
		clearDB();
		return done();
	}

}

export function afterMongoose(done) {
	mongoose.models = {};
	mongoose.modelSchemas = {};
	done();
}

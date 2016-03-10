import {expect} from 'chai';
// import {configMongoTest} from '../../testConfig';
// import {getPub} from '../pub-routes';

// var mongoose = require('mongoose');
// const dbURI    = 'mongodb://localhost:27017';
// const clearDB  = require('mocha-mongoose')(dbURI);

describe('API', () => {
	describe('pub-routes.js', () => {
		

		// before(function(done) {
		// 	if (mongoose.connection.db) return done();
		// 	mongoose.connect(dbURI, done);
		// });
		
		// beforeEach(function(done) {
		// 	clearDB(done);
		// });



		// configMongoTest();

		// beforeEach(function (done) {

		//   function clearDB() {
		//     for (var i in mongoose.connection.collections) {
		//       mongoose.connection.collections[i].remove(function() {});
		//     }
		//     return done();
		//   }


		//   if (mongoose.connection.readyState === 0) {
		//     mongoose.connect(dbURI, function (err) {
		//       if (err) {
		//         throw err;
		//       }
		//       return clearDB();
		//     });
		//   } else {
		//     return clearDB();
		//   }
		// });


		// afterEach(function (done) {
		//   mongoose.disconnect();
		//   return done();
		// });

		it('should get an empty pub', () => {
			const req = {query: {slug: 'refactor5'}};
			// getPub(req, function(status, json){
			// 	console.log(status, json);

			// 	// return res.status(status).json(json);	
			// });

		});
	});
});


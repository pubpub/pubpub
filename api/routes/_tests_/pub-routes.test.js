// import httpMocks from 'node-mocks-http';
// import {expect} from 'chai';
// import {beforeEachMongoose, afterMongoose} from '../../../tests/helpersServer';
// import {getPub} from '../pub-routes';

// describe('API', () => {
// 	describe('pub-routes.js', () => {

// 		beforeEach(beforeEachMongoose);
// 		after(afterMongoose);

// 		it('should get an empty pub', function(done){
// 			const req = {query: {slug: 'refactor5'}};
// 			const res = httpMocks.createResponse({
// 			  eventEmitter: require('events').EventEmitter
// 			});

// 			getPub(req, res);

// 			res.on('end', function() {
// 				const data = JSON.parse( res._getData() );
// 				const status = res.statusCode;
// 				// console.log(data);
// 				// console.log(status);

// 				expect(status).to.equal(201);
// 				done();
// 			});

// 		});

// 	});
// });


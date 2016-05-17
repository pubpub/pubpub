import httpMocks from 'node-mocks-http';
import {expect} from 'chai';
import {beforeEachMongoose, afterMongoose} from 'tests/helpersServer';
import {loadAppAndLogin} from '../app-routes';

describe('API', () => {
	describe('app-routes.js', () => {

		beforeEach(beforeEachMongoose);
		after(afterMongoose);

		it('should load with empty request data', function(done){
			const req = {};
			const res = httpMocks.createResponse({
			  eventEmitter: require('events').EventEmitter
			});

			loadAppAndLogin(req, res);

			res.on('end', function() {
				const data = JSON.parse( res._getData() );
				const status = res.statusCode;

				expect(status).to.equal(201);
				done();
			});

		});

		it('should load en locale by default', function(done){
			const req = {};
			const res = httpMocks.createResponse({
			  eventEmitter: require('events').EventEmitter
			});

			loadAppAndLogin(req, res);

			res.on('end', function() {
				const data = JSON.parse( res._getData() );
				const status = res.statusCode;

				expect(data.languageData.locale).to.equal('en');
				done();
			});

		});

		it('should load user data from req', function(done){
			const req = {
				user: {
					_id: '507f191e810c19729de860ea'
				}
			};
			const res = httpMocks.createResponse({
			  eventEmitter: require('events').EventEmitter
			});

			loadAppAndLogin(req, res);

			res.on('end', function() {
				const data = JSON.parse( res._getData() );
				const status = res.statusCode;

				expect(data.loginData._id).to.equal('507f191e810c19729de860ea');
				done();
			});

		});

	});
});

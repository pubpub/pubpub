import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {UserProfileFollowers} from './UserProfileFollowers.jsx'

describe('Components', () => {
	describe('UserProfileFollowers.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(UserProfileFollowers, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

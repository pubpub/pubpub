import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {UserProfileFollowing} from './UserProfileFollowing.jsx'

describe('Components', () => {
	describe('UserProfileFollowing.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(UserProfileFollowing, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

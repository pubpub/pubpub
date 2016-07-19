import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {UserProfile} from './UserProfile.jsx'

describe('Components', () => {
	describe('UserProfile.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(UserProfile, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

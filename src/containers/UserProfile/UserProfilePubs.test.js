import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {UserProfilePubs} from './UserProfilePubs.jsx'

describe('Components', () => {
	describe('UserProfilePubs.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(UserProfilePubs, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

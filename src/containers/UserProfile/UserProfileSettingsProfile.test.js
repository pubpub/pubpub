import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {UserProfileSettingsProfile} from './UserProfileSettingsProfile.jsx'

describe('Components', () => {
	describe('UserProfileSettingsProfile.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(UserProfileSettingsProfile, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

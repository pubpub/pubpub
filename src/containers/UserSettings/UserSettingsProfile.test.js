import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {UserSettingsProfile} from './UserSettingsProfile.jsx'

describe('Components', () => {
	describe('UserSettingsProfile.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(UserSettingsProfile, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

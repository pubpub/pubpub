import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {UserProfileSettingsNotifications} from './UserProfileSettingsNotifications.jsx'

describe('Components', () => {
	describe('UserProfileSettingsNotifications.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(UserProfileSettingsNotifications, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

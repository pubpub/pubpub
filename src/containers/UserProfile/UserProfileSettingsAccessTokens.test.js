import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {UserProfileSettingsAccessTokens} from './UserProfileSettingsAccessTokens.jsx'

describe('Components', () => {
	describe('UserProfileSettingsAccessTokens.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(UserProfileSettingsAccessTokens, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

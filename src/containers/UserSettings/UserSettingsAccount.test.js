import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {UserSettingsAccount} from './UserSettingsAccount.jsx'

describe('Components', () => {
	describe('UserSettingsAccount.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(UserSettingsAccount, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

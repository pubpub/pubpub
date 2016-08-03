import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {ResetPassword} from './ResetPassword.jsx'

describe('Components', () => {
	describe('ResetPassword.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(ResetPassword, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {EmailVerification} from './EmailVerification.jsx'

describe('Components', () => {
	describe('EmailVerification.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(EmailVerification, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

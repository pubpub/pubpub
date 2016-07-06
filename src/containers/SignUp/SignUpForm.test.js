import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {SignUpForm} from './SignUpForm.jsx'

describe('Components', () => {
	describe('SignUpForm.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(SignUpForm, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

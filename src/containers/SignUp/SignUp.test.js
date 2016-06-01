import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {SignUp} from './SignUp.jsx'

describe('Components', () => {
	describe('SignUp.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(SignUp, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

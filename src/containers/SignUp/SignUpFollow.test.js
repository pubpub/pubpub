import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {SignUpFollow} from './SignUpFollow.jsx'

describe('Components', () => {
	describe('SignUpFollow.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(SignUpFollow, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

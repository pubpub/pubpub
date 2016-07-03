import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {Login} from './Login.jsx'

describe('Components', () => {
	describe('Login.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(Login, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

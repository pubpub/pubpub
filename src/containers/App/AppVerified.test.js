import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import AppVerified from './AppVerified.jsx'

describe('Components', () => {
	describe('AppVerified.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AppVerified, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

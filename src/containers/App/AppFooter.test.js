import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import AppFooter from './AppFooter.jsx'

describe('Components', () => {
	describe('AppFooter.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AppFooter, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

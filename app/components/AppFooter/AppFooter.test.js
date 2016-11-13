import {expect} from 'chai';
import {shallowRender} from 'tests/helpers';
import AppFooter from './AppFooter.js'

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

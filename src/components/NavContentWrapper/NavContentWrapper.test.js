import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {NavContentWrapper} from './NavContentWrapper.jsx'

describe('Components', () => {
	describe('NavContentWrapper.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(NavContentWrapper, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

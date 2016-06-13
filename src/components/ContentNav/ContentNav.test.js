import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {ContentNav} from './ContentNav.jsx'

describe('Components', () => {
	describe('ContentNav.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(ContentNav, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

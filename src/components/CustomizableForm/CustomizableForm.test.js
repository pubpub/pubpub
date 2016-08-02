import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {CustomizableForm} from './CustomizableForm.jsx'

describe('Components', () => {
	describe('CustomizableForm.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(CustomizableForm, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

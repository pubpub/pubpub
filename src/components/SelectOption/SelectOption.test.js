import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {SelectOption} from './SelectOption.jsx'

describe('Components', () => {
	describe('SelectOption.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(SelectOption, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

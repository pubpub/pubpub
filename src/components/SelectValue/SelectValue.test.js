import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {SelectValue} from './SelectValue.jsx'

describe('Components', () => {
	describe('SelectValue.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(SelectValue, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

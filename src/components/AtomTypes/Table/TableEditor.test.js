import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {TableEditor} from './TableEditor.jsx'

describe('Components', () => {
	describe('TableEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(TableEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

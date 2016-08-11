import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {PDFEditor} from './PDFEditor.jsx'

describe('Components', () => {
	describe('PDFEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(PDFEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

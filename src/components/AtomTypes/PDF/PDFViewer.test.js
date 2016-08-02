import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {PDFViewer} from './PDFViewer.jsx'

describe('Components', () => {
	describe('PDFViewer.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(PDFViewer, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

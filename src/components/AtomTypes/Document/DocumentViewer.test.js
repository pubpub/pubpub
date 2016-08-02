import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {DocumentViewer} from './DocumentViewer.jsx'

describe('Components', () => {
	describe('DocumentViewer.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(DocumentViewer, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

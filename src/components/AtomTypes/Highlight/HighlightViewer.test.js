import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {HighlightViewer} from './HighlightViewer.jsx'

describe('Components', () => {
	describe('HighlightViewer.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(HighlightViewer, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

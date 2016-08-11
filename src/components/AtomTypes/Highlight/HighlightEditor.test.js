import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {HighlightEditor} from './HighlightEditor.jsx'

describe('Components', () => {
	describe('HighlightEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(HighlightEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

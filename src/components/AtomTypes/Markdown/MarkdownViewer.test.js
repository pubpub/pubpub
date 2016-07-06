import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {MarkdownViewer} from './MarkdownViewer.jsx'

describe('Components', () => {
	describe('MarkdownViewer.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(MarkdownViewer, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {CodeViewer} from './CodeViewer.jsx'

describe('Components', () => {
	describe('CodeViewer.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(CodeViewer, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

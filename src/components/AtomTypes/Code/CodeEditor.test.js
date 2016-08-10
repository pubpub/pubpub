import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {CodeEditor} from './CodeEditor.jsx'

describe('Components', () => {
	describe('CodeEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(CodeEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

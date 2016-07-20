import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {LaTeXEditor} from './LaTeXEditor.jsx'

describe('Components', () => {
	describe('LaTeXEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(LaTeXEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

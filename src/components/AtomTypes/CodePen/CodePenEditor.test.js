import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {CodePenEditor} from './CodePenEditor.jsx'

describe('Components', () => {
	describe('CodePenEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(CodePenEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

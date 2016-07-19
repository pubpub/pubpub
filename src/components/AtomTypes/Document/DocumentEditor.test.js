import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {DocumentEditor} from './DocumentEditor.jsx'

describe('Components', () => {
	describe('DocumentEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(DocumentEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

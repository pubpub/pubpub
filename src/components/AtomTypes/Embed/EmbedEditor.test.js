import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {EmbedEditor} from './EmbedEditor.jsx'

describe('Components', () => {
	describe('EmbedEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(EmbedEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {IFrameEditor} from './IFrameEditor.jsx'

describe('Components', () => {
	describe('IFrameEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(ImFrameEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

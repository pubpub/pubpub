import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {ImageEditor} from './ImageEditor.jsx'

describe('Components', () => {
	describe('ImageEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(ImageEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

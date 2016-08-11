import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {ImageCropperEditor} from './ImageCropperEditor.jsx'

describe('Components', () => {
	describe('ImageCropperEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(ImageCropperEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

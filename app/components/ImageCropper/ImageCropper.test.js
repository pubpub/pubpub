import { expect } from 'chai';
import { shallowRender } from 'tests/helpers';
import { ImageCropper } from './ImageCropper.jsx';

describe('Components', () => {
	describe('ImageCropper.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const { renderOutput, error } = shallowRender(ImageCropper, props);

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

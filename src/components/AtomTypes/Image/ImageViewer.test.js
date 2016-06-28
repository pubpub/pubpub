import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {ImageViewer} from './ImageViewer.jsx'

describe('Components', () => {
	describe('ImageViewer.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(ImageViewer, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {VideoViewer} from './VideoViewer.jsx'

describe('Components', () => {
	describe('VideoViewer.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(VideoViewer, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {VideoEditor} from './VideoEditor.jsx'

describe('Components', () => {
	describe('VideoEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(VideoEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

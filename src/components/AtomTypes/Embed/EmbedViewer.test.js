import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {EmbedViewer} from './EmbedViewer.jsx'

describe('Components', () => {
	describe('EmbedViewer.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(EmbedViewer, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

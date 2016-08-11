import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {ReferenceViewer} from './ReferenceViewer.jsx'

describe('Components', () => {
	describe('ReferenceViewer.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(ReferenceViewer, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomViewerPane} from './AtomViewerPane.jsx'

describe('Components', () => {
	describe('AtomViewerPane.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomViewerPane, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

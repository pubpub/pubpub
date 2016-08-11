import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomEditorPublishing} from './AtomEditorPublishing.jsx'

describe('Components', () => {
	describe('AtomEditorPublishing.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomEditorPublishing, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

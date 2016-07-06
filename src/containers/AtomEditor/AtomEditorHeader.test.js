import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomEditorHeader} from './AtomEditorHeader.jsx'

describe('Components', () => {
	describe('AtomEditorHeader.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomEditorHeader, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

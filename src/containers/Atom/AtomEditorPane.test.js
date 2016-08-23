import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomEditorPane} from './AtomEditorPane.jsx'

describe('Components', () => {
	describe('AtomEditorPane.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomEditorPane, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

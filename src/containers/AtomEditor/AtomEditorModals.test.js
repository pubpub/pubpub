import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomEditorModals} from './AtomEditorModals.jsx'

describe('Components', () => {
	describe('AtomEditorModals.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomEditorModals, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

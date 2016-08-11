import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomEditorSaveVersion} from './AtomEditorSaveVersion.jsx'

describe('Components', () => {
	describe('AtomEditorSaveVersion.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomEditorSaveVersion, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

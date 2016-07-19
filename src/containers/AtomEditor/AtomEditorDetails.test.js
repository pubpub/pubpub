import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomEditorDetails} from './AtomEditorDetails.jsx'

describe('Components', () => {
	describe('AtomEditorDetails.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomEditorDetails, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

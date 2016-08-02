import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {ReferenceEditor} from './ReferenceEditor.jsx'

describe('Components', () => {
	describe('ReferenceEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(ReferenceEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

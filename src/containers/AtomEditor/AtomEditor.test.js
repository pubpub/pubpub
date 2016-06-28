import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomEditor} from './AtomEditor.jsx'

describe('Components', () => {
	describe('AtomEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

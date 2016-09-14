import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomContents} from './AtomContents.jsx'

describe('Components', () => {
	describe('AtomContents.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomContents, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

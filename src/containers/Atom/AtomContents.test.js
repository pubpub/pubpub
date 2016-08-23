import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomHeader} from './AtomHeader.jsx'

describe('Components', () => {
	describe('AtomHeader.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomHeader, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

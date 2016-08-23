import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomDetails} from './AtomDetails.jsx'

describe('Components', () => {
	describe('AtomDetails.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomDetails, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

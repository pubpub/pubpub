import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomJournals} from './AtomJournals.jsx'

describe('Components', () => {
	describe('AtomJournals.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomJournals, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

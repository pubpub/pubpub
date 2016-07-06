import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomReaderJournals} from './AtomReaderJournals.jsx'

describe('Components', () => {
	describe('AtomReaderJournals.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomReaderJournals, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

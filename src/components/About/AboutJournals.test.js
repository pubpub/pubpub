import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AboutJournals} from './AboutJournals.jsx'

describe('Components', () => {
	describe('AboutJournals.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AboutJournals, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

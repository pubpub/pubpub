import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
<<<<<<< Updated upstream
import {AboutJournals} from './AboutJournals.jsx'
=======
import AboutJournals from './AboutJournals.jsx'
>>>>>>> Stashed changes

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

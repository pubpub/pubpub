import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
<<<<<<< Updated upstream
import {AboutPubs} from './AboutPubs.jsx'
=======
import AboutPubs from './AboutPubs.jsx'
>>>>>>> Stashed changes

describe('Components', () => {
	describe('AboutPubs.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AboutPubs, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

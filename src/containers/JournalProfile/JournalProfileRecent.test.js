import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JournalProfileRecent} from './JournalProfileRecent.jsx'

describe('Components', () => {
	describe('JournalProfileRecent.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JournalProfileRecent, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

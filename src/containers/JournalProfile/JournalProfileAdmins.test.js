import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JournalProfileAdmins} from './JournalProfileAdmins.jsx'

describe('Components', () => {
	describe('JournalProfileAdmins.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JournalProfileAdmins, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

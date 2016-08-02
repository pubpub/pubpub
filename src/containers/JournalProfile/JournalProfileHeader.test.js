import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JournalProfileHeader} from './JournalProfileHeader.jsx'

describe('Components', () => {
	describe('JournalProfileHeader.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JournalProfileHeader, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

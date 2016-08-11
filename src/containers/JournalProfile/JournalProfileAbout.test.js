import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JournalProfileAbout} from './JournalProfileAbout.jsx'

describe('Components', () => {
	describe('JournalProfileAbout.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JournalProfileAbout, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

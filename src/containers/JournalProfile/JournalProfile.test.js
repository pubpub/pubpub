import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JournalProfile} from './JournalProfile.jsx'

describe('Components', () => {
	describe('JournalProfile.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JournalProfile, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

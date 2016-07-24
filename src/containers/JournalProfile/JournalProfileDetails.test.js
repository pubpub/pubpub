import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JournalProfileDetails} from './JournalProfileDetails.jsx'

describe('Components', () => {
	describe('JournalProfileDetails.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JournalProfileDetails, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

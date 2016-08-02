import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JournalProfileSubmitted} from './JournalProfileSubmitted.jsx'

describe('Components', () => {
	describe('JournalProfileSubmitted.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JournalProfileSubmitted, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JournalProfileLayout} from './JournalProfileLayout.jsx'

describe('Components', () => {
	describe('JournalProfileLayout.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JournalProfileLayout, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

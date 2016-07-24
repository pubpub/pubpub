import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JournalCreate} from './JournalCreate.jsx'

describe('Components', () => {
	describe('JournalCreate.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JournalCreate, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

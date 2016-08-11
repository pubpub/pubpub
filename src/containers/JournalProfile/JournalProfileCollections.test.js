import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JournalProfileCollections} from './JournalProfileCollections.jsx'

describe('Components', () => {
	describe('JournalProfileCollections.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JournalProfileCollections, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

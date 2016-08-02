import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {UserProfileJournals} from './UserProfileJournals.jsx'

describe('Components', () => {
	describe('UserProfileJournals.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(UserProfileJournals, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

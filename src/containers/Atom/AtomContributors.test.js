import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomContributors} from './AtomContributors.jsx'

describe('Components', () => {
	describe('AtomContributors.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomContributors, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomReaderContributors} from './AtomReaderContributors.jsx'

describe('Components', () => {
	describe('AtomReaderContributors.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomReaderContributors, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

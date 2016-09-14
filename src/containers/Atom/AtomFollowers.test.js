import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomFollowers} from './AtomFollowers.jsx'

describe('Components', () => {
	describe('AtomFollowers.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomFollowers, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

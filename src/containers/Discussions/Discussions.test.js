import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {Discussions} from './Discussions.jsx'

describe('Components', () => {
	describe('Discussions.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(Discussions, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

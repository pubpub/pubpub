import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomCiteButton} from './AtomCiteButton.jsx'

describe('Components', () => {
	describe('AtomCiteButton.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomCiteButton, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

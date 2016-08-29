import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomVersionsButton} from './AtomVersionsButton.jsx'

describe('Components', () => {
	describe('AtomVersionsButton.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomVersionsButton, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

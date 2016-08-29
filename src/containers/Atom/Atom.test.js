import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {Atom} from './Atom.jsx'

describe('Components', () => {
	describe('Atom.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(Atom, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

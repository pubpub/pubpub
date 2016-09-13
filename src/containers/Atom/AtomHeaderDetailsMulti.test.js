import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomHeaderDetailsMulti} from './AtomHeaderDetailsMulti.jsx'

describe('Components', () => {
	describe('AtomHeaderDetailsMulti.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomHeaderDetailsMulti, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomMeta} from './AtomMeta.jsx'

describe('Components', () => {
	describe('AtomMeta.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomMeta, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

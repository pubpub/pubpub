import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomReader} from './AtomReader.jsx'

describe('Components', () => {
	describe('AtomReader.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomReader, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

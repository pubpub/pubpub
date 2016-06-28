import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomReaderHeader} from './AtomReaderHeader.jsx'

describe('Components', () => {
	describe('AtomReaderHeader.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomReaderHeader, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

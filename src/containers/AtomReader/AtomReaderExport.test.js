import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomReaderExport} from './AtomReaderExport.jsx'

describe('Components', () => {
	describe('AtomReaderExport.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomReaderExport, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

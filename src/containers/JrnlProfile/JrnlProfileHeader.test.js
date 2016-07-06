import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlProfileHeader} from './JrnlProfileHeader.jsx'

describe('Components', () => {
	describe('JrnlProfileHeader.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlProfileHeader, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

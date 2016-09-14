import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomHeaderDetail} from './AtomHeaderDetail.jsx'

describe('Components', () => {
	describe('AtomHeaderDetail.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomHeaderDetail, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

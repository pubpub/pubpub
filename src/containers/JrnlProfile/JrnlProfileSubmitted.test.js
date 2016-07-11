import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlProfileSubmitted} from './JrnlProfileSubmitted.jsx'

describe('Components', () => {
	describe('JrnlProfileSubmitted.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlProfileSubmitted, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

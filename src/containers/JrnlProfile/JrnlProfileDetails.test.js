import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlProfileDetails} from './JrnlProfileDetails.jsx'

describe('Components', () => {
	describe('JrnlProfileDetails.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlProfileDetails, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

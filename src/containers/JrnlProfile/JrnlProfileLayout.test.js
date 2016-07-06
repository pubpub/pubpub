import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlProfileLayout} from './JrnlProfileLayout.jsx'

describe('Components', () => {
	describe('JrnlProfileLayout.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlProfileLayout, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

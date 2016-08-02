import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import About from './About.jsx'

describe('Components', () => {
	describe('About.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(About, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

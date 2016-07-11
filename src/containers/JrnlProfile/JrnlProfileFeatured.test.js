import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlProfileFeatured} from './JrnlProfileFeatured.jsx'

describe('Components', () => {
	describe('JrnlProfileFeatured.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlProfileFeatured, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

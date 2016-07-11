import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlFeatured} from './JrnlFeatured.jsx'

describe('Components', () => {
	describe('JrnlFeatured.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlFeatured, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

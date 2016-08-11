import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AboutReviews} from './AboutReviews.jsx'

describe('Components', () => {
	describe('AboutReviews.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AboutReviews, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

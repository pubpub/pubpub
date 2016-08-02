import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {PreviewCard} from './PreviewCard.jsx'

describe('Components', () => {
	describe('PreviewCard.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(PreviewCard, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

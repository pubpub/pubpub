import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {Landing} from './Landing.jsx'

describe('Components', () => {
	describe('Landing.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(Landing, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

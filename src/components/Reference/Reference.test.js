import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {Reference} from './Reference.jsx'

describe('Components', () => {
	describe('Reference.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(Reference, props);

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

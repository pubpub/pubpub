import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {NotFound} from './NotFound.jsx'

describe('Components', () => {
	describe('NotFound.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(NotFound, props);

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

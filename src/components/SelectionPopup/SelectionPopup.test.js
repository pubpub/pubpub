import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {SelectionPopup} from './SelectionPopup.jsx'

describe('Components', () => {
	describe('SelectionPopup.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(SelectionPopup, props);

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

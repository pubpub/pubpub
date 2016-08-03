import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {LoaderDeterminate} from './LoaderDeterminate.jsx'

describe('Components', () => {
	describe('LoaderDeterminate.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(LoaderDeterminate, props);

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

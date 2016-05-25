import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {Loader} from './Loader.jsx'

describe('Components', () => {
	describe('Loader.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(Loader, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

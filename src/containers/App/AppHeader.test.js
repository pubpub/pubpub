import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AppHeader} from './AppHeader.jsx'

describe('Components', () => {
	describe('AppHeader.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AppHeader, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

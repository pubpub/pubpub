import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AppLoadingBar} from './AppLoadingBar.jsx'

describe('Components', () => {
	describe('AppLoadingBar.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AppLoadingBar, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

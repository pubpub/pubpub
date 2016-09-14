import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AppMessage} from './AppMessage.jsx'

describe('Components', () => {
	describe('AppMessage.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AppMessage, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

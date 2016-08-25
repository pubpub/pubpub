import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {Manage} from './Manage.jsx'

describe('Components', () => {
	describe('Manage.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(Manage, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

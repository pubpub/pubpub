import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlCreate} from './JrnlCreate.jsx'

describe('Components', () => {
	describe('JrnlCreate.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlCreate, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

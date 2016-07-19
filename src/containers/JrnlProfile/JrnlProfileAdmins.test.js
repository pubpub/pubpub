import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlProfileAdmins} from './JrnlProfileAdmins.jsx'

describe('Components', () => {
	describe('JrnlProfileAdmins.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlProfileAdmins, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

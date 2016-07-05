import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlProfile} from './JrnlProfile.jsx'

describe('Components', () => {
	describe('JrnlProfile.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlProfile, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

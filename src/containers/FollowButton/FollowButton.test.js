import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {FollowButton} from './FollowButton.jsx'

describe('Components', () => {
	describe('FollowButton.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(FollowButton, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

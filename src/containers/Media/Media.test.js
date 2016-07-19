import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {Media} from './Media.jsx'

describe('Components', () => {
	describe('Media.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(Media, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

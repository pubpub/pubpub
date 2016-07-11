import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlCollections} from './JrnlCollections.jsx'

describe('Components', () => {
	describe('JrnlCollections.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlCollections, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlProfileCollections} from './JrnlProfileCollections.jsx'

describe('Components', () => {
	describe('JrnlProfileCollections.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlProfileCollections, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomReaderFollowers} from './AtomReaderFollowers.jsx'

describe('Components', () => {
	describe('AtomReaderFollowers.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomReaderFollowers, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

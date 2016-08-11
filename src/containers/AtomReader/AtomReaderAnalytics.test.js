import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomReaderAnalytics} from './AtomReaderAnalytics.jsx'

describe('Components', () => {
	describe('AtomReaderAnalytics.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomReaderAnalytics, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

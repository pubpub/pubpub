import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomReaderVersions} from './AtomReaderVersions.jsx'

describe('Components', () => {
	describe('AtomReaderVersions.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomReaderVersions, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

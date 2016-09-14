import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomExportButton} from './AtomExportButton.jsx'

describe('Components', () => {
	describe('AtomExportButton.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomExportButton, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

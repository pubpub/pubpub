import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomSaveVersionButton} from './AtomSaveVersionButton.jsx'

describe('Components', () => {
	describe('AtomSaveVersionButton.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomSaveVersionButton, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

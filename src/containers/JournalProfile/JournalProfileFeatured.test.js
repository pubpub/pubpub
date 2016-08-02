import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JournalProfileFeatured} from './JournalProfileFeatured.jsx'

describe('Components', () => {
	describe('JournalProfileFeatured.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JournalProfileFeatured, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {AtomEditorContributors} from './AtomEditorContributors.jsx'

describe('Components', () => {
	describe('AtomEditorContributors.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(AtomEditorContributors, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

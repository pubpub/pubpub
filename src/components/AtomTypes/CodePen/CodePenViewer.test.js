import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {CodePenViewer} from './CodePenViewer.jsx'

describe('Components', () => {
	describe('CodePenViewer.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(CodePenViewer, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

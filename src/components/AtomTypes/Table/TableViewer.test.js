import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {TableViewer} from './TableViewer.jsx'

describe('Components', () => {
	describe('TableViewer.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(TableViewer, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JupyterEditor} from './JupyterEditor.jsx'

describe('Components', () => {
	describe('JupyterEditor.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JupyterEditor, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered

		});

	});
});

import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {Map} from 'immutable';
import {App} from './App.jsx'

// This test is mostly meaningless as App.jsx is simply a wrapper around other components.
// The nesting of these wrappers mean that shallowRender won't actually do anything of importance.
describe('Components', () => {
	describe('App.jsx', () => {

		it('should render with null props', () => {
			const props = {
				path: '',
				appData: Map(),
			};
			const {renderOutput, error} = shallowRender(App, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});

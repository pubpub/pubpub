import React from 'react'
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import TestUtils from 'react-addons-test-utils'
import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import License, {License as LicenseUnwrapped} from './License.jsx'

describe('Components', () => {
	describe('License.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(LicenseUnwrapped, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

		it('should accept custom text', () => {
			const props = {text: 'My custom text'};
			const component = TestUtils.renderIntoDocument(
				<License {...props} />
			);
			const renderedDOM = ReactDOM.findDOMNode(component);
			expect(renderedDOM.textContent).to.equal('My custom text Creative Commons Attribution 4.0 International License.');
		});

		it('should change when hover prop is true', () => {

			const componentHoverTrue = ReactDOMServer.renderToStaticMarkup(
				<License hover={true} />
			);

			const componentHoverFalse = ReactDOMServer.renderToStaticMarkup(
				<License hover={false} />
			);

			expect(componentHoverTrue).to.not.equal(componentHoverFalse);
		});


	});
});

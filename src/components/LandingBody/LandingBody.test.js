import React from 'react'
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import TestUtils from 'react-addons-test-utils'
import {expect} from 'chai';
import LandingBody from './LandingBody.jsx'

describe('Components', () => {
	describe('LandingBody.jsx', () => {
  	
		it('should exist when rendered with empty props', () => { // This still seems to pass even if there is a rendering error?
			const props = {};
			const component = TestUtils.renderIntoDocument( 
				<LandingBody {...props} />
			);
			const renderedDOM = ReactDOM.findDOMNode(component);
			expect(renderedDOM).to.exist;
		});

	});
});
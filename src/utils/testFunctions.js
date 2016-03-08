import React from 'react'
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils'
import {expect} from 'chai';

export function checkRenderSuccess(Component, props) {
	// Render the component into a real DOM (Phantom, Chrome, etc);
	const domComponent = TestUtils.renderIntoDocument( 
		<Component {...props} />
	);
	const domRender = ReactDOM.findDOMNode(domComponent);

	// Use shallow render to check if rendered output is an error message
	const renderer = TestUtils.createRenderer()
	renderer.render(
		<Component {...props} />
	);
	const shallowRender = renderer.getRenderOutput()
	
	// In the case of an error, grab the error message from domRender
	const message = domRender.children && domRender.children[0] ? domRender.children[0].innerText : 'Error (didn\'t catch the error message';

	// Return both results so we can make expect() calls
	return {domRender, shallowRender, message};
}
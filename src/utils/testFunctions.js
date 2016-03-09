import React from 'react'
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils'
import {expect} from 'chai';
import {IntlProvider} from 'react-intl';

export function checkRenderSuccess(Component, props) {
	// Render the component into a real DOM (Phantom, Chrome, etc);
	const intlProvider = new IntlProvider({locale: 'en'}, {});
	const {intl} = intlProvider.getChildContext();

	const domComponent = TestUtils.renderIntoDocument( 
		<IntlProvider locale={'en'} >
			<Component {...props} intl={intl} />
		</IntlProvider>
	);
	const domRender = ReactDOM.findDOMNode(domComponent);

	// Use shallow render to check if rendered output is an error message
	// const renderer = TestUtils.createRenderer()
	// renderer.render(
	// 	<IntlProvider locale={'en'} >
	// 		<Component {...props} intl={intl} />
	// 	</IntlProvider>
	// );
	// const shallowRender = renderer.getRenderOutput()
	
	// In the case of an error, grab the error message from domRender
	const message = domRender.children && domRender.children[0] ? domRender.children[0].innerText : 'Error (didn\'t catch the error message';

	// Return both results so we can make expect() calls
	return {domRender, message};
}
import React from 'react'
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils'
import {expect} from 'chai';
import {IntlProvider} from 'react-intl';
import {StyleRoot} from 'radium';

export function checkRenderSuccess(Component, props) {
	const intlProvider = new IntlProvider({locale: 'en'}, {});
	const {intl} = intlProvider.getChildContext();

	// Render the component into a real DOM (Phantom, Chrome, etc);
	const domComponent = TestUtils.renderIntoDocument( 
		<IntlProvider locale={'en'} >
			<StyleRoot>
				<Component {...props} intl={intl} />
			</StyleRoot>
		</IntlProvider>
	);
	const domRender = ReactDOM.findDOMNode(domComponent);
	
	// In the case of an error, grab the error message from domRender
	const message = domRender.children && domRender.children[0] ? domRender.children[0].innerText : 'Error (didn\'t catch the error message';
	const isErrorScreen = domRender.innerHTML.indexOf('http://localhost:9876/base/tests.webpack.js') > -1;

	// Return both results so we can make expect() calls
	return {domRender, message, isErrorScreen};
}
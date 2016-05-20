import React from 'react';
import TestUtils from 'react-addons-test-utils';
// import ReactDOM from 'react-dom';
// import { createStore } from 'redux';
// import {Provider} from 'react-redux';
// import {IntlProvider} from 'react-intl';
// import Radium, {StyleRoot} from 'radium';
import Radium from 'radium';
Radium.TestMode.enable(); // used to avoid addCSS errors which arise when shallowRendering

// Use this function to test an unwrapped component (i.e. not wrapped in export Radium(Component) ).
// This function shallow renders the components. Real DOMs not used.
export function shallowRender(Component, props) {
	const renderer = TestUtils.createRenderer();
	renderer.render(<Component {...props} />);
	const renderOutput = renderer.getRenderOutput();
	const error = renderOutput.props.error;

	return {renderOutput, error};
}

/*
From experience so far, the errors that have caused any issues have been ones that shallowRender would catch.
DOM-specific errors have not arisen, so let's see how far shallow rendering gets us,
given that it is much simpler to write and faster to test. Easier test dev environment = less barrier to writing tests.


// Use this function to test connected components (containers)
// and for tests that need Radium or Intl. 
// Since we are wrapping the component in <Provider> <IntlProvider> 
// and <StyleRoot> we can't do a shallow-render (TestUtils.createRenderer())
// as it would only render the top component (hence shallow...).
// This function renders the components deeply and into a real DOM (defined through Karma).
export function checkWrappedRenderSuccess(Component, props) {
	const intlProvider = new IntlProvider({locale: 'en'}, {});
	const {intl} = intlProvider.getChildContext();
	const store = createStore(()=>{return {};});

	// Render the component into a real DOM (Phantom, Chrome, etc);
	const domComponent = TestUtils.renderIntoDocument( 
		<Provider store={store} key="provider">
			<IntlProvider locale={'en'} >
				<StyleRoot>
					<Component {...props} intl={intl} />
				</StyleRoot>
			</IntlProvider>
		</Provider>
	);
	const domRender = ReactDOM.findDOMNode(domComponent);
	
	// In the case of an error, grab the error message from domRender
	const message = domRender.children && domRender.children[0] ? domRender.children[0].innerText : 'Error (didn\'t catch the error message';
	const isErrorScreen = domRender.innerHTML.indexOf('http://localhost:9876/base/tests.webpack.js') > -1;

	return {domRender, message, isErrorScreen};
}

// Use this function to test an unwrapped component (i.e. not wrapped in export Radium(Component) ).
// This function renders the components deeply and into a real DOM (defined through Karma).
export function checkUnwrappedRenderSuccess(Component, props) {

	// Render the component into a real DOM (Phantom, Chrome, etc);
	const domComponent = TestUtils.renderIntoDocument( 
		<Component {...props} />
	);
	const domRender = ReactDOM.findDOMNode(domComponent);
	
	// In the case of an error, grab the error message from domRender
	const message = domRender.children && domRender.children[0] ? domRender.children[0].innerText : 'Error (didn\'t catch the error message';
	const isErrorScreen = domRender.innerHTML.indexOf('http://localhost:9876/base/tests.webpack.js') > -1;

	// Return both results so we can make expect() calls
	return {domRender, message, isErrorScreen};
}

*/



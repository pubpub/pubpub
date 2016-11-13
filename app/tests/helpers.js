import React from 'react';
import TestUtils from 'react-addons-test-utils';
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

import React from 'react'
import TestUtils from 'react-addons-test-utils'
import {StyleRoot} from "radium";

export function renderComponent(Component, props) {
  let renderer = TestUtils.createRenderer();
  renderer.render( 
  	<StyleRoot>
  		<Component {...props} />
  	</StyleRoot>
  );
  let output = renderer.getRenderOutput();
  console.log(document);
  console.log(output.props.children);
  console.log(output.props.children.length);
  return {
    props,
    output,
    renderer
  };

  // console.log('gunna try');
  // const component = TestUtils.renderIntoDocument( 
  //   <StyleRoot>
  //     <Component {...props} />
  //   </StyleRoot>
  // );
  // console.log(component);
  // return component;
}

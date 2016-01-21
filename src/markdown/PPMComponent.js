import React, { PropTypes } from 'react';
import MDReactComponent from './MDReactComponent';

import abbr from 'markdown-it-abbr';
import emoji from 'markdown-it-emoji';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import container from 'markdown-it-container';
import ppm from './markdown-it-ppm';

import {parsePluginString} from '../utils/ParsePlugins';
import {Image} from '../components/EditorPluginsNew/index';


const handleIterate = function(Tag, props, children) {

  switch(Tag) {
  case 'table':
    props.className = 'table table-striped';
    break;
  case 'div':
  	if (props['data-info']) {
  		props.className = props.className ? props.className + props['data-info'] : props['data-info'];
  	}
    break;
  case 'ppm':
    props.className = 'ppm';
    console.log('Got a ppm!!!');
    console.log(children);
    console.log(props);
    if (children.length > 1) {
      console.log('Wierd!!');
    }
    const Component = Image.Component;
    const ImageProps = parsePluginString(children[0]);
    console.log(ImageProps);
    return <Component props={ImageProps}/>;
    break;
  case 'code':
    if (props['data-language']) {
      return <Tag {...props} dangerouslySetInnerHTML={{__html: window.hljs.highlight(props['data-language'], children[0]).value}} />
    };
    break;
  }
  return <Tag {...props}>{children}</Tag>;
}

const PPMComponent = React.createClass({
	propTypes: {
		markdown: PropTypes.string,
		assets: PropTypes.array,
		references: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			markdown: '',
			assets: [],
			references: [],
		};
	},

	render: function() {
		return (
			<MDReactComponent text={this.props.markdown}
				onIterate={handleIterate}
				markdownOptions={{
					typographer: true,
					linkify: true,
				}}
				plugins={[
					abbr,
					emoji,
					sub,
					sup,
					{plugin: container, args: ['blank', {validate: ()=>{return true;}}]},
          			ppm
				]} />
		);
	}
});

export default PPMComponent;

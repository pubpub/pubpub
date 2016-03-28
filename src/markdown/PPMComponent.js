import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import MDReactComponent from './MDReactComponent';

import abbr from 'markdown-it-abbr';
import emoji from 'markdown-it-emoji';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import container from 'markdown-it-container';
import ppm from './markdown-it-ppm';
import pubheader from './markdown-it-pubheader';
import pubheaderitem from './markdown-it-pubheaderitem';

import mathIt from 'markdown-it-math';

import {parsePluginString} from '../utils/parsePlugins';
import Plugins from '../components/EditorPlugins/index';
import InputFields from '../components/EditorPluginFields/index';

import MathComponent from './MathComponent';
import HTMLComponent from './HTMLComponent';

import murmur from 'murmurhash';


const MathOptions = {
	inlineOpen: '$$',
	inlineClose: '$$',
	blockOpen: '$$$',
	blockClose: '$$$',
	inlineRenderer: function(str) {
		return 'math';
	},
	blockRenderer: function(str) {
		return 'math';
	},
};

const PPMComponent = React.createClass({
	propTypes: {
		markdown: PropTypes.string,

		assets: PropTypes.object,
		references: PropTypes.object,
		selections: PropTypes.array,

	},

	getInitialState() {
		this.globals = {};
		return {};
	},

	getDefaultProps: function() {
		return {
			markdown: '',
			assets: {},
			references: {},
			selections: [],
		};
	},

	handleIterate: function(globals, Tag, props, children) {
		let Component = Tag;

		switch(Tag) {
		case 'h1':
		case 'h2':
		case 'h3':
		case 'h4':
		case 'h5':
		case 'h6':
			props.id = children[0] && children[0].replace ? children[0].replace(/\s/g, '-').toLowerCase() : undefined;
			break;

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
			if (children.length > 1) {
				console.warn('A component should not have multiple children', children);
			}

			if (children[0] === 'pagebreak') {
				return <div className={'pagebreak'} style={{display: 'block', borderTop: '1px dashed #ddd'}}></div>
			}
			if (children[0] === 'linebreak') {
				return <div className={'linebreak p-block'} style={{display: 'block', height: '1.5em'}}></div>
			}

			const pluginString = children[0];
			let pluginProps = parsePluginString(pluginString);

			const pluginName = pluginProps.pluginType;
			const plugin = (pluginName) ? Plugins[pluginName] : null;

			if (!plugin) {
				if (__DEVELOPMENT__) {
					console.warn('Could not find a plugin');
				}
				return <span {...props}>{children}</span>;
			}

			Component = plugin.Component;
			const PluginInputFields = plugin.InputFields;

			for (const propName in pluginProps) {
				const propVal = pluginProps[propName];
				const pluginInputField = PluginInputFields.find( field => field.title === propName);
				if (pluginInputField) {
					let inputVal = pluginProps[propName];
					const InputFieldType = pluginInputField.type;
					const Field = InputFields[InputFieldType];
					if (InputFields[InputFieldType].transform) {
						pluginProps[propName] = InputFields[InputFieldType].transform(propVal, pluginInputField.params, this.props.assets, this.props.references, this.props.selections);
					}
				}
			}

			if (plugin.Config.prerender) {
				({globals, pluginProps} = plugin.Config.prerender(globals, pluginProps));
			}

			return <Component {...props} {...pluginProps} />;
			break;

		case 'code':
			if (props['data-language']) {
				try{
					return <Tag {...props} className={'codeBlock'} dangerouslySetInnerHTML={{__html: window.hljs.highlight(props['data-language'], children[0]).value}} />
				} catch (err) {
					// console.log(err);
				}

			}
			props.className = 'codeBlock';
			break;

		case 'math':
			return <MathComponent>{children[0]}</MathComponent>;
			break;
		case 'htmlblock':
			const text = children[0];
			if (typeof text === 'string' || text instanceof String) {
				return <HTMLComponent>{text}</HTMLComponent>;
				break;
	    }
		case 'p':
			// if (children[0] === null){ return null; }
			// console.log('p arguments', arguments);
			props.className = 'p-block';
			props['data-hash'] = children[0] ? murmur.v2(children[0]) : 0;
			Component = 'div';
			break;
		case 'li':
			props['data-hash'] = children[0] ? murmur.v2(children[0]) : 0;
			break;
		case 'hr':
			return <Component  {...props} />
		case 'pubheader':
			// console.log(arguments);
			Component = 'div';
			props.id = 'pub-header';
			break;
		case 'pubheaderitem':


			if (props.className === 'author') {

			// 	console.log('trying to set to author');
				console.log(props, children);
				if (children.length > 1) { // If the author field has multiple children, and thus is nested, it is assumed the first field is the user's username, and thus we link to it.
					return <Link className={'author pubheaderitem'} to={'/user/' + children[0].props.children[0]}>{children.slice(1, children.length)}</Link>;
				}
				// return <div>Woopie - {children[0].props.children[0]}</div>
			}

			// Removes the unnecessary p-block wrapper from headeritems
			const newChildren = [];
			for (let index = 0; index < children.length; index++) {
				if (children[index].props && children[index].props.className === 'p-block') {
					newChildren.push(children[index].props.children);
				} else {
					newChildren.push(children[index]);
				}
			}
			children = newChildren;

			Component = 'div';
			props.className = props.className + ' pubheaderitem';
			// props['data-hash'] = children[0] ? murmur.v2(children[0]) : 0;
			break;
		case 'pubtitle':
			if (children[0] && children[0].props) {
				children[0] = children[0].props.children
			}
			Component = 'div';
			props.id = 'pub-title';
			break;

		}


		return <Component {...props}>{children}</Component>;
	},

	render: function() {
		for (const member in this.globals) delete this.globals[member];

		return (
			<MDReactComponent
				text={this.props.markdown}
				onIterate={this.handleIterate.bind(this, this.globals)}
				markdownOptions={{
					typographer: true,
					linkify: true,
				}}
				plugins={[
					abbr,
					emoji,
					sub,
					sup,
					{plugin: mathIt, args: [MathOptions]},
					{plugin: container, args: ['blank', {validate: ()=>{return true;}}]},
					ppm,
					pubheader,
					pubheaderitem
				]} />
		);
	}
});

export default PPMComponent;

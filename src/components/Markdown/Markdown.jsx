import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import MarkdownMDReact from './MarkdownMDReact';

import abbr from 'markdown-it-abbr';
import emoji from 'markdown-it-emoji';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import container from 'markdown-it-container';
import mathIt from 'markdown-it-math';
import ppm from './markdown-it-ppm';
import pubheader from './markdown-it-pubheader';
import pubheaderitem from './markdown-it-pubheaderitem';

import {parsePluginString} from 'utils/parsePlugins';
import Plugins from './MarkdownPlugins';
import InputFields from './MarkdownPluginFields';
import Modes from './MarkdownModes/index';

import MarkdownMath from './MarkdownComponents/MarkdownMath';
import MarkdownHTML from './MarkdownComponents/MarkdownHTML';
import MarkdownReferences from './MarkdownComponents/MarkdownReferences';
import MarkdownFootnotes from './MarkdownComponents/MarkdownFootnotes';
import MarkdownHeader from './MarkdownComponents/MarkdownHeader';

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

const Markdown = React.createClass({
	propTypes: {
		markdown: PropTypes.string,
		assets: PropTypes.object,
		references: PropTypes.object,
		selections: PropTypes.array,
		mode: PropTypes.string,

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

		if (this.props.mode && Modes[this.props.mode] && Modes[this.props.mode].handleIterate) {
			const iterate = Modes[this.props.mode].handleIterate(globals, Tag, props, children);
			if (iterate) {
				return iterate;
			}
		}

		switch (Tag) {
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
				return <div mode={this.props.mode} className={'pagebreak'} style={{display: 'block', borderTop: '1px dashed #ddd'}}></div>;
			}
			if (children[0] === 'linebreak') {
				return <div  mode={this.props.mode} className={'linebreak p-block'} style={{display: 'block', height: '1.5em'}}></div>;
			}

			const pluginString = children[0];
			let pluginProps = parsePluginString(pluginString);

			const pluginName = pluginProps.pluginType;
			const plugin = (pluginName) ? Plugins[pluginName] : null;

			if (!plugin) {
				// if (__DEVELOPMENT__) {
					// console.warn('Could not find a plugin');
				// }
				return <span {...props}></span>;
			}

			Component = plugin.Component;
			const PluginInputFields = plugin.InputFields;

			for (const propName in pluginProps) {
				const propVal = pluginProps[propName];
				const pluginInputField = PluginInputFields.find( field => field.title === propName);
				if (pluginInputField) {
					const inputVal = pluginProps[propName];
					const InputFieldType = pluginInputField.type;
					// const Field = InputFields[InputFieldType];
					if (InputFields[InputFieldType].transform) {
						pluginProps[propName] = InputFields[InputFieldType].transform(propVal, pluginInputField.params, this.props.assets, this.props.references, this.props.selections);
					}
				}
			}

			if (plugin.Config.prerender) {
				({globals, pluginProps} = plugin.Config.prerender(globals, pluginProps));
			}

			return <Component mode={this.props.mode} {...props} {...pluginProps} />;
			break;

		case 'code':
			if (props['data-language']) {
				try {
					return <Tag mode={this.props.mode}  {...props} className={'codeBlock'} dangerouslySetInnerHTML={{__html: window.hljs.highlight(props['data-language'], children[0]).value}} />;
				} catch (err) {
					// console.log(err);
				}

			}
			props.className = 'codeBlock';
			break;

		case 'math':
			return <MarkdownMath mode={this.props.mode}>{children[0]}</MarkdownMath>;
		case 'htmlblock':
			const text = children[0];
			if (typeof text === 'string' || text instanceof String) {
				return <MarkdownHTML mode={this.props.mode}>{text}</MarkdownHTML>;
			}
			break;
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
		case 'a':
			props['target'] = "_blank";
			break;
		case 'hr':
			return <Component mode={this.props.mode} {...props} />;

		case 'references':
			return <MarkdownReferences mode={this.props.mode} references={globals.sortedReferences}/>;

		case 'footnotes':
			return <MarkdownFootnotes mode={this.props.mode} footnotes={globals.footnotes}/>;

		case 'pubheader':
			// console.log(arguments);
			return <MarkdownHeader mode={this.props.mode}>{children}</MarkdownHeader>;
			break;
		case 'pubheaderitem':
			if (props.className === 'author' && children.length > 1) { // If the author field has multiple children, and thus is nested, it is assumed the first field is the user's username, and thus we link to it.
				return <Link key={props.key} className={'author pubheaderitem'} to={'/user/' + children[0].props.children[0]}>{children.slice(1, children.length)}</Link>;
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
		}


		return <Component mode={this.props.mode}{...props}>{children}</Component>;
	},



	findFootnotes: function(markdown) {
		const footnoteRegex = /\[\[{"pluginType":"footnote".*?\]\]/g;
		const matches = markdown.match(footnoteRegex);
		if (matches && matches.length > 0) {
			const footnotes = matches.map((match) => parsePluginString(match)).filter((footnote) => (!!footnote.footnote));
			return footnotes;
		}
		return [];
	},

	findReferences: function(markdown) {
		const references = [];
		const referencesObj = {};
		const citeRegex = /\[\[{"pluginType":"cite".*?\]\]/g;
		const matches = markdown.match(citeRegex);
		if (matches) {
			for (const match of matches) {
				const citeStr = match.slice(2, -2);
				const ref = parsePluginString(citeStr).reference;
				const label = (ref) ? ref.label : null;
				if (label && !referencesObj[label]) {
					referencesObj[label] = 1;
					references.push(ref);
				}
			}
		} else {
			return [];
		}
		return references;
	},

	treeProcessor: function(tree) {
		const footnotes = (this.props.markdown) ? this.findFootnotes(this.props.markdown) : [];
		const sortedReferences = (this.props.markdown) ? this.findReferences(this.props.markdown) : [];
		this.globals.sortedReferences = sortedReferences;
		this.globals.footnotes = footnotes;
		tree.push(['references']);
		tree.push(['footnotes']);
		return tree;
	},

	render: function() {
		for (const member in this.globals) {
			if (this.globals.hasOwnProperty(member)) {
				delete this.globals[member];
			}
		}


		return (
			<MarkdownMDReact
				text={this.props.markdown}
				onIterate={this.handleIterate.bind(this, this.globals)}
				treeProcessor={this.treeProcessor}
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

export default Markdown;

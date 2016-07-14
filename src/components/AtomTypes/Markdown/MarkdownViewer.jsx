import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Markdown} from 'components';
import {safeGetInToJS} from 'utils/safeParse';
import {schema} from './schema';
import {Node} from 'prosemirror/dist/model';
import EmbedWrapper from './EmbedWrapper';

let styles = {};

export const MarkdownViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	componentDidMount() {
		// const markdown = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'markdown']);
		// const t0 = performance.now();
		// const output = this.iterateChildren(markdown.content);
		// const t1 = performance.now();
		// console.log('JSON -> React took ' + (t1 - t0) + ' milliseconds.');
	},

	iterateChildren: function(item) {
		if (!item) {return null;}

		return item.map((node, index)=>{
			switch (node.type) {
			case 'heading': 
				return React.createElement('h' + node.attrs.level, {key: index}, this.iterateChildren(node.content));
				// return <h1>{this.iterateChildren(node.content)}</h1>;
			case 'blockquote':
				return <blockquote key={index}>{this.iterateChildren(node.content)}</blockquote>;
			case 'ordered_list': 
				return <ol start={node.attrs.order === 1 ? null : node.attrs.oder} key={index}>{this.iterateChildren(node.content)}</ol>;
			case 'bullet_list':
				return <ul key={index}>{this.iterateChildren(node.content)}</ul>;
			case 'list_item':
				return <li key={index}>{this.iterateChildren(node.content)}</li>;
			case 'horizontal_rule':
				return <hr key={index}/>;
			case 'code_block':
				return <pre key={index}><code>{this.iterateChildren(node.content)}</code></pre>;
			case 'paragraph':
				return <div className={'p-block'} key={index}>{this.iterateChildren(node.content)}</div>;
			case 'image':
				return <img {...node.attrs} key={index}/>;
			case 'hard_break':
				return <br key={index}/>;
			case 'text':
				const marks = node.marks || [];
				return marks.reduce((previous, current)=>{
					switch (current._) {
					case 'strong':
						return <strong key={index}>{previous}</strong>;
					case 'em':
						return <em key={index}>{previous}</em>;
					case 'code':
						return <code key={index}>{previous}</code>;
					case 'link':
						return <a href={current.href} title={current.title} key={index}>{previous}</a>;
					default: 
						return previous;
					}
				}, node.text);
			case 'embed':
				return <EmbedWrapper source={node.attrs.source} className={node.attrs.className} key={index}/>;
			default:
				console.log('Error with ', node);
				// return <div>{node.type}: {this.iterateChildren(node.content)}</div>;
			}
		});
	},

	render: function() {
		const markdown = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'markdown']);
		const output = this.iterateChildren(markdown.content);

		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
			return <div>Check out this sweet markdown!</div>;
		case 'full':
		case 'static-full':
		default:
			// return <Markdown markdown={markdown} />;
			// return <div id="body"></div>;
			return <div>{output}</div>;
		}

	}
});

export default Radium(MarkdownViewer);

styles = {

};

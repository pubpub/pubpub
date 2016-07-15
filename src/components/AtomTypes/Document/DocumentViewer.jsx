import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import EmbedWrapper from './EmbedWrapper';

export const DocumentViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	iterateChildren: function(item) {
		if (!item) {return null;}

		return item.map((node, index)=>{
			switch (node.type) {
			case 'heading': 
				return React.createElement('h' + node.attrs.level, {key: index}, this.iterateChildren(node.content));
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
				return <EmbedWrapper {...node.attrs} key={index}/>;
			default:
				console.log('Error with ', node);
			}
		});
	},

	render: function() {
		const docJSON = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'docJSON']);
		const output = this.iterateChildren(docJSON && docJSON.content);

		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
			return <div>Check out this sweet document!</div>;
		case 'full':
		case 'static-full':
		default:
			return <div>{output}</div>;
		}

	}
});

export default Radium(DocumentViewer);

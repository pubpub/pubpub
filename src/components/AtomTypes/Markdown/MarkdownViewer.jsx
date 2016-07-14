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
		// const html = Node.fromJSON(schema, markdown).content.toDOM();
		// document.getElementById('body').appendChild(html);

		// y = new node
		// dom = require('testdom')('<html><body></body></html>');
		// y.content.toDOM({document: dom})
	},

	iterateChildren: function(item) {
		return item.map((element)=>{
			switch (element.type) {
			case 'heading': 
				return <h1>{this.iterateChildren(element.content)}</h1>;
			case 'text':
				return element.text;
			case 'embed':
				return <EmbedWrapper source={element.attrs.source} className={element.attrs.className}/>;
			default:
				console.log(element);
				return <div>{element.type}: {this.iterateChildren(element.content)}</div>;
			}
		});
	},

	render: function() {
		const markdown = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'markdown']);

		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
			return <div>Check out this sweet markdown!</div>;
		case 'full':
		case 'static-full':
		default:
			// return <Markdown markdown={markdown} />;
			// return <div id="body"></div>;
			return <div>{this.iterateChildren(markdown.content)}</div>;
		}

	}
});

export default Radium(MarkdownViewer);

styles = {

};

import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Markdown} from 'components';

let styles = {};

export const MarkdownViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	render: function() {
		const markdown = this.props.atomData.getIn(['currentVersionData', 'content', 'markdown']);

		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
			return <div>Check out this sweet markdown!</div>;
		case 'full':
		case 'static-full':
		default:
			return <Markdown markdown={markdown} />;
		}

	}
});

export default Radium(MarkdownViewer);

styles = {

};

import React, {PropTypes} from 'react';
import sanitizeHtml from 'sanitize-html';


const HTMLPlugin = React.createClass({
	propTypes: {
		children: PropTypes.any
	},
	render: function() {

		const dirtyHTML = this.props.children;
		const cleanHTML = sanitizeHtml(dirtyHTML, {
		  allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
			allowedAttributes: {
			  a: [ 'href', 'name', 'target' ],
			  img: [ 'src' ]
			},
		});
		return (
			<div dangerouslySetInnerHTML={{__html: cleanHTML}} />
		);
	}
});

export default HTMLPlugin;

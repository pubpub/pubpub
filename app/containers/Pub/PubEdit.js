import React, { PropTypes } from 'react';
import ReactMarkdown from 'react-markdown';

let styles;

export const PubEdit = React.createClass({
	propTypes: {
		versionData: PropTypes.object,
		updateEditValue: PropTypes.func,
	},

	render: function() {
		let md = this.props.versionData.files.reduce((previous, current, index)=> {
			if (current.name === 'main.md') {
				return current.value;
			} 
			return previous;
		}, '');

		return (
			<div style={styles.pubBody}>
				<h2>Editor</h2>
				<textarea onChange={this.props.updateEditValue} defaultValue={md} style={styles.textarea}></textarea>
			</div>
		);
	}
});

export default PubEdit;

styles = {
	pubBody: {
		padding: '1.25em',
		fontFamily: 'serif',
		lineHeight: '1.6em',
		fontSize: '1.2em',
		color: '#333',
		maxWidth: '700px',
	},
	textarea: {
		width: '100%',
		height: '300px',
	}
};

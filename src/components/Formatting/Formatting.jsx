import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import dateFormat from 'dateformat';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const Formatting = React.createClass({
	propTypes: {
		type: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			type: '',
		};
	},

	render: function() {

		switch (this.props.type) {
		case 'header1':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Header 1</div>
					<div style={styles.formattingHint}># Header</div>
				</div>
			);
		case 'header2':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Header 2</div>
					<div style={styles.formattingHint}>## Header</div>
				</div>
			);
		case 'header3':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Header 3</div>
					<div style={styles.formattingHint}>### Header</div>
				</div>
			);
		case 'bold':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Bold</div>
					<div style={[styles.formattingHint, styles.bold]}>**bold**</div>
				</div>
			);
		case 'italic':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Italic</div>
					<div style={[styles.formattingHint, styles.italic]}>*italic*</div>
				</div>
			);
		case 'ol':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Numbered List</div>
					<div style={styles.formattingHint}>1. item</div>
				</div>
			);
		case 'ul':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Bullet List</div>
					<div style={styles.formattingHint}>- item</div>
				</div>
			);
		case 'line':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Line</div>
					<div style={styles.formattingHint}>***</div>
				</div>
			);
		case 'link':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Link</div>
					<div style={styles.formattingHint}>[text](url)</div>
				</div>
			);
		case 'image':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Image</div>
					<div style={styles.formattingHint}>
						<div style={styles.plugin}>[[image]]</div>
					</div>
				</div>
			);
		case 'video':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Video</div>
					<div style={styles.formattingHint}>
						<div style={styles.plugin}>[[video]]</div>
					</div>
				</div>
			);
		case 'cite':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Cite</div>
					<div style={styles.formattingHint}>
						<div style={styles.plugin}>[[cite]]</div>
					</div>
				</div>
			);
		case 'pagebreak':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Pagebreak</div>
					<div style={styles.formattingHint}>
						<div style={styles.plugin}>[[pagebreak]]</div>
					</div>
				</div>
			);
		case 'linebreak':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Linebreak</div>
					<div style={styles.formattingHint}>
						<div style={styles.plugin}>[[linebreak]]</div>
					</div>
				</div>
			);
		case 'quote':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Quote</div>
					<div style={styles.formattingHint}>
						<div style={styles.plugin}>[[quote]]</div>
					</div>
				</div>
			);
		case 'pubList':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Pub List</div>
					<div style={styles.formattingHint}>
						<div style={styles.plugin}>[[pubList]]</div>
					</div>
				</div>
			);
		case 'collectionList':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Collection List</div>
					<div style={styles.formattingHint}>
						<div style={styles.plugin}>[[collectionList]]</div>
					</div>
				</div>
			);
		case 'pageLink':
			return (
				<div style={styles.formattingWrapper}>
					<div style={styles.formattingName}>Button Link</div>
					<div style={styles.formattingHint}>
						<div style={styles.plugin}>[[link]]</div>
					</div>
				</div>
			);
		default:
			return <div>Invalid Type</div>;
		}
		
	}
});

export default Radium(Formatting);

styles = {
	formattingWrapper: {
		width: '23em'
	},
	formattingName: {
		display: 'inline-block',
		width: '8em',
		fontWeight: '400',
	},
	formattingHint: {
		display: 'inline-block',
		width: 'calc(15em - 16px)',
		paddingRight: 16,
		textAlign: 'right',
		fontFamily: 'Courier',
		fontSize: '14px',
		color: '#888',
	},
	bold: {
		fontWeight: 'bold',
	},
	italic: {
		fontStyle: 'italic',
	},
	plugin: {
		// backgroundColor: '#bbb',
		// color: '#111',
		// borderRadius: '2px',
		// display: 'inline-block',
		// padding: '0px 4px',
		// lineHeight: '19px',
	}
};



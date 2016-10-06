import scholar from 'google-scholar-link';
import Radium from 'radium';
import React, {PropTypes} from 'react';
import {Reference} from 'components';
// import {FormattedMessage} from 'react-intl';
import {safeGetInToJS} from 'utils/safeParse';

let styles = {};

export const ReferenceViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
		context: PropTypes.oneOf(['reference-list', 'document', 'library']),
	},

	render: function() {

		const referenceData = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content']) || {};
		let scholarLink;

		if (this.props.context === 'reference-list') {
			return <Reference citationObject={referenceData} showNote={true}/>;
		}

		if (referenceData.title) {
			// Generates a google scholar link based on the title & author
			// scholarLink = scholar(referenceData.title, {language: 'en', author: referenceData.author || ''});
			scholarLink = scholar(referenceData.title, {language: 'en'});
		}

		const referenceKeys = Object.values(referenceData).reduce((count, reference) => {
			return (!!reference) ? count + 1 : count;
		}, 0);
		const showReference = !(referenceKeys === 0 || (referenceKeys === 1 && referenceData.note));

		switch (this.props.renderType) {
		case 'full':
		case 'static-full':
		case 'embed':
		case 'static-embed':
		default:
			return (
				<div style={styles.container}>

					{(referenceData.title) ? <h4 style={styles.header}>{referenceData.title}</h4>
					: null }

					{(referenceData.author) ? <div>{referenceData.author}</div>
					: null }

					{(referenceData.note) ?
						<div style={styles.quoteContent}>
							{referenceData.note}
						</div>
					: null }

					{(showReference) ?
					<span>
						<div style={styles.referenceHeader}>Reference:</div>
						<div style={styles.citeContent}>
							<Reference citationObject={referenceData} showNote={false}/>
						</div>
					</span>
					: null }

					{/* Needs to be internationalized */}
					{(referenceData.url) ? <a href={referenceData.url.substring(0, 4) === 'http' ? referenceData.url : 'http://' + referenceData.url} style={styles.button} className={'button light-button'} target="_blank">
					View Link</a> : null }

					{(referenceData.title) ? <a href={scholarLink} style={styles.button} className={'button light-button'} target="_blank">
					Google Scholar </a> : null }

				</div>
			);
		}
	}
});

styles = {
	referenceHeader: {
		marginBottom: '-0.2em',
		fontFamily: 'Courier',
		fontSize: '0.8em',
	},
	header: {
		marginBottom: '0.5em',
		marginTop: '0em',
	},
	container: {
		fontSize: '0.70em',
		lineHeight: '1.5',
		cursor: 'text',
	},
	button: {
		// fontSize: '0.85em',
		fontFamily: 'Open Sans',
		marginRight: '1em',
		fontSize: '0.75em',
		lineHeight: '1.25em',
		color: '#808284',
	},
	citeContent: {
		color: '#58585B',
		margin: '0em 0em 1em 0em',
		padding: '.5em',
		outline: 'none',
		fontFamily: 'Courier',
		boxShadow: '0px 0px 0px 1px #ddd',
		borderRadius: '1px',
		wordBreak: 'break-all',
	},
	quoteContent: {
		padding: '0.01em 1em',
		margin: '1em 0em',
		fontSize: '1.1em',
		borderLeft: '4px solid #F3F3F4',
		fontStyle: 'italic',
	},
};

export default Radium(ReferenceViewer);

import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

const Reference = React.createClass({
	propTypes: {
		citationObject: PropTypes.object,
		mode: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			citationObject: {},
			mode: 'mla'
		};
	},

	
	render: function() {
		const citation = this.props.citationObject;
		const citationStrings = {};

		// Switch over string construction statements, based on mode.
		switch (this.props.mode) {
		case 'mla':
			citationStrings.title = citation.title ? '"' + citation.title + '". ' : '';
			citationStrings.author = citation.author ? citation.author + '. ' : '';
			citationStrings.journal = citation.journal ? citation.journal + '. ' : '';
			citationStrings.publisher = citation.publisher ? citation.publisher + ', ' : '';
			citationStrings.year = citation.year ? '(' + citation.year + '): ' : '';
			citationStrings.volume = citation.volume ? 'Vol. ' + citation.volume + '. ' : '';
			citationStrings.number = citation.number ? 'Num. ' + citation.number + '. ' : '';
			citationStrings.pages = citation.pages ? citation.pages + '. ' : '';
			citationStrings.url = citation.url ? '[' + citation.url + '] ' : '';
			citationStrings.note = citation.note ? citation.note : '';
			break;

		case 'chicago':
			citationStrings.title = citation.title ? '"' + citation.title + '". ' : '';
			citationStrings.author = citation.author ? citation.author + '. ' : '';
			citationStrings.journal = citation.journal ? citation.journal + '. ' : '';
			citationStrings.publisher = citation.publisher ? citation.publisher + ', ' : '';
			citationStrings.year = citation.year ? '(' + citation.year + '): ' : '';
			citationStrings.volume = citation.volume ? 'Vol. ' + citation.volume + '. ' : '';
			citationStrings.number = citation.number ? 'Num. ' + citation.number + '. ' : '';
			citationStrings.pages = citation.pages ? citation.pages + '. ' : '';
			citationStrings.url = citation.url ? '[' + citation.url + '] ' : '';
			citationStrings.note = citation.note ? citation.note : '';
			break;

		case 'apa':
			citationStrings.title = citation.title ? '' + citation.title + '. ' : '';
			citationStrings.author = citation.author ? citation.author + '. ' : '';
			citationStrings.journal = citation.journal ? citation.journal + ', ' : '';
			citationStrings.publisher = citation.publisher ? citation.publisher + ', ' : '';
			citationStrings.year = citation.year ? '(' + citation.year + '). ' : '';
			citationStrings.volume = citation.volume ? 'Vol. ' + citation.volume + '. ' : '';
			citationStrings.number = citation.number ? 'Num. ' + citation.number + '. ' : '';
			citationStrings.pages = citation.pages ? citation.pages + '. ' : '';
			citationStrings.url = citation.url ? '[' + citation.url + '] ' : '';
			citationStrings.note = citation.note ? citation.note : '';
			break;

		default:
			break;
		}

		// Switch over return statements, based on mode.
		switch (this.props.mode) {
		case 'mla':
			return (<span>
				{citationStrings.author}
				{citationStrings.title}
				<span style={styles.italic}>{citationStrings.journal}</span>
				{citationStrings.volume}
				{citationStrings.publisher}
				{citationStrings.year}
				{citationStrings.journal}
				{citationStrings.number}
				{citationStrings.pages}
				{citationStrings.url}
				{citationStrings.note}
			</span>);

		case 'chicago':
			return (<span>
				{citationStrings.author}
				{citationStrings.title}
				<span style={styles.italic}>{citationStrings.journal}</span>
				{citationStrings.volume}
				{citationStrings.publisher}
				{citationStrings.year}
				{citationStrings.journal}
				{citationStrings.number}
				{citationStrings.pages}
				{citationStrings.url}
				{citationStrings.note}
			</span>);

		case 'apa':
			return (<span>
				{citationStrings.author}
				{citationStrings.year}
				{citationStrings.title}
				<span style={styles.italic}>{citationStrings.journal}</span>
				{citationStrings.volume}
				{citationStrings.publisher}
				
				{citationStrings.journal}
				{citationStrings.number}
				{citationStrings.pages}
				{citationStrings.url}
				{citationStrings.note}
			</span>);

		default:
			return null;
		}
		
	}
});

export default Radium(Reference);

styles = {
	bold: {
		fontWeight: 'bold',
	},
	italic: {
		fontStyle: 'italic',
	}
};

import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const Reference = React.createClass({
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
		let bibtexString = null;
		// console.log(citation);
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
			citationStrings.doi = citation.doi ? citation.doi : '';
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
			citationStrings.doi = citation.doi ? citation.doi : '';
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
			citationStrings.doi = citation.doi ? ' ' + citation.doi : '';
			break;
		case 'bibtex':
			const journalString = citation.journal ? `
  journal={` + citation.journal + `},` : '';
  			const doiString = citation.doi ? `
  doi={` + citation.doi + `},` : '';

			bibtexString = `@article{` + (citation.title && citation.title.replace(/[^A-Za-z0-9]/g, '').substring(0, 12)) + citation.year + `,
  title={` + citation.title + `},
  author={` + citation.author + `},
  year={` + citation.year + `},
  note={` + citation.note + `},` + doiString + `
  publisher={PubPub},` + journalString + `
}`;
			break;

		default:
			break;
		}

		// Switch over return statements, based on mode.
		switch (this.props.mode) {
		case 'mla':
			return (<span>
				{citationStrings.author && citationStrings.author.replace(/\.\./g, '.')}
				{citationStrings.title}
				<span style={styles.italic}>{citationStrings.journal}</span>
				{citationStrings.volume}
				{citationStrings.publisher}
				{citationStrings.year}
				{citationStrings.number}
				{citationStrings.pages}
				<a href={citation.url} style={{textDecoration: 'none', color: 'inherit'}}>{citationStrings.url}</a>
				{citationStrings.note}
				{citationStrings.doi}
			</span>);

		case 'chicago':
			return (<span>
				{citationStrings.author && citationStrings.author.replace(/\.\./g, '.')}
				{citationStrings.title}
				<span style={styles.italic}>{citationStrings.journal}</span>
				{citationStrings.volume}
				{citationStrings.publisher}
				{citationStrings.year}
				{citationStrings.number}
				{citationStrings.pages}
				<a href={citation.url} style={{textDecoration: 'none', color: 'inherit'}}>{citationStrings.url}</a>
				{citationStrings.note}
				{citationStrings.doi}
			</span>);

		case 'apa':
			return (<span>
				{citationStrings.author && citationStrings.author.replace(/\.\./g, '.')}
				{citationStrings.year}
				{citationStrings.title}
				<span style={styles.italic}>{citationStrings.journal}</span>
				{citationStrings.volume}
				{citationStrings.publisher}

				{citationStrings.number}
				{citationStrings.pages}
				<a href={citation.url} style={{textDecoration: 'none', color: 'inherit'}}>{citationStrings.url}</a>
				{citationStrings.note}
				{citationStrings.doi}
			</span>);
		case 'bibtex':
			return (<span>
				{bibtexString}
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

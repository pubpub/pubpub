import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Reference} from 'components';
import {safeGetInToJS} from 'utils/safeParse';

let styles;

export const AtomCiteButton = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		authorsData: PropTypes.array,
		customAuthorString: PropTypes.string,
		versionQuery: PropTypes.string,
		buttonStyle: PropTypes.object,
		
	},

	render: function() {
		const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || {};
		const versionData = safeGetInToJS(this.props.atomData, ['currentVersionData']) || {};
		const authorsData = safeGetInToJS(this.props.atomData, ['authorsData']) || [];

		const author = this.props.customAuthorString || authorsData.reduce((previousValue, currentValue, currentIndex, array)=>{
			const currentAuthor = currentValue.source;
			const authorString = array.length === currentIndex + 1 ? currentAuthor.name : currentAuthor.name + ', ';
			return previousValue + authorString;
		}, '');

		const referenceObject = {
			title: atomData.title,
			author: author,
			url: 'https://www.pubpub.org/pub/' + atomData.slug + this.props.versionQuery,
			note: 'version: ' + versionData._id,
			year: String(new Date(versionData.createDate).getFullYear()),
			// journal: if viewed from journal, place here
			publisher: 'PubPub',
		};


		return (
			<div className={'light-button arrow-down-button'} style={this.props.buttonStyle}>Cite
				<div className={'hoverChild arrow-down-child'} style={styles.citeContent}>
					<h3 className={'normalWeight'}>Bibtex</h3>
					<div style={[styles.typeContent, styles.bibtexContent]}>
						<Reference citationObject={referenceObject} mode={'bibtex'} />
					</div>

					<h3 className={'normalWeight'}>APA</h3>
					<div style={styles.typeContent}>
						<Reference citationObject={referenceObject} mode={'apa'} />
					</div>

					<h3 className={'normalWeight'}>MLA</h3>
					<div style={styles.typeContent}>
						<Reference citationObject={referenceObject} mode={'mla'} />
					</div>

					<h3 className={'normalWeight'}>Chicago</h3>
					<div style={styles.typeContent}>
						<Reference citationObject={referenceObject} mode={'chicago'} />
					</div>
				</div>
			</div>
		);

	}
});

export default Radium(AtomCiteButton);

styles = {
	citeContent: {
		padding: '1em',
		userSelect: 'initial',
		width: '400px',
	},
	typeContent: {
		color: '#58585B',
		margin: '1em 0em 2em 0em',
		padding: '.5em',
		outline: 'none',
		fontFamily: 'Courier',
		boxShadow: '0px 0px 0px 1px #ddd',
		borderRadius: '1px',
		wordBreak: 'break-all',
	},
	bibtexContent: {
		whiteSpace: 'pre-wrap',
	},
};

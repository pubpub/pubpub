import React, { PropTypes } from 'react';
import Radium from 'radium';
import {baseStyles} from './pubModalStyle';
// import {globalStyles} from '../../utils/styleConstants';
import {Reference} from '../';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const PubModalCite = React.createClass({
	propTypes: {
		pubData: PropTypes.object,
		journalName: PropTypes.string,
		isFeatured: PropTypes.bool,
	},

	getDefaultProps: function() {
		return {
			pubData: {},
		};
	},

	render: function() {
		const referenceObject = {
			title: this.props.pubData.title,
			journal: this.props.isFeatured ? this.props.journalName : 'PubPub',
			publisher: 'PubPub',
			year: new Date(this.props.pubData.publishDate).getFullYear(),
		};
		if (this.props.isFeatured) {
			referenceObject.url = typeof(window) !== 'undefined' ? window.location.protocol + '//' + window.location.host + window.location.pathname : '';
		} else {
			referenceObject.url = typeof(window) !== 'undefined' ? window.location.protocol + '//www.pubpub.org' + window.location.pathname : '';
		}

		const author = this.props.pubData.authors.reduce((previousValue, currentValue, currentIndex, array)=>{
			const lastName = array[currentIndex].lastName || 'Lastname';
			const firstName = array[currentIndex].firstName ? array[currentIndex].firstName.charAt(0) + '.' : 'F.';
			const authorString = array.length === currentIndex + 1 ? lastName + ', ' + firstName : lastName + ', ' + firstName + ', ';
			return previousValue + authorString;
		}, '');
		

		referenceObject.author = author;

		return (
			<div style={baseStyles.pubModalContainer}>

				{/* TODO: use the <Reference/> component for the styling. Just gotta make the citation object first. */}

				<div style={baseStyles.pubModalTitle}>
					<FormattedMessage {...globalMessages.cite} />
				</div>
				<div style={baseStyles.pubModalContentWrapper}>

					<div style={styles.typeTitle}>Bibtex</div>
					<div style={[styles.typeContent, styles.bibtexContent]}>
						<Reference citationObject={referenceObject} mode={'bibtex'} />
					</div>

					<div style={styles.typeTitle}>APA</div>
					<div style={styles.typeContent}>
						<Reference citationObject={referenceObject} mode={'apa'} />
					</div>

					<div style={styles.typeTitle}>MLA</div>
					<div style={styles.typeContent}>
						<Reference citationObject={referenceObject} mode={'mla'} />
					</div>

					<div style={styles.typeTitle}>Chicago</div>
					<div style={styles.typeContent}>
						<Reference citationObject={referenceObject} mode={'chicago'} />
					</div>

				</div>

			</div>
		);
	}
});

export default Radium(PubModalCite);

styles = {
	typeTitle: {
		fontSize: '20px',
		color: '#777',
	},
	typeContent: {
		margin: '15px 5px',
		padding: '5px',
		color: '#555',
		outline: 'none',
		overflowY: 'scroll',
		fontFamily: 'Courier',
		fontSize: '14px',
		boxShadow: '0px 0px 0px 1px #ddd',
		borderRadius: '1px',
	},
	bibtexContent: {
		whiteSpace: 'pre',
	},
};

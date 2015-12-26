import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Autocomplete} from '../../containers';
// import {LoaderIndeterminate} from '../../components';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const JournalCurate = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		journalSaving: PropTypes.bool,
		journalSaveHandler: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			journalData: {},
		};
	},

	featurePub: function(pubID) {
		return () => {
			const outputFeaturedPubs = this.props.journalData.pubsFeatured.map((pub)=>{ return pub._id; });
			outputFeaturedPubs.push(pubID);

			let outputSubmittedPubs = this.props.journalData.pubsSubmitted.filter((pub)=>{ return pub._id !== pubID; });
			outputSubmittedPubs = outputSubmittedPubs.map((pub)=>{ return pub._id; });
			
			this.props.journalSaveHandler({
				pubsFeatured: outputFeaturedPubs,
				pubsSubmitted: outputSubmittedPubs,
			});
		};
	},

	render: function() {
		return (
			<div style={styles.container}>
				<div style={styles.pubSectionsWrapper}>
					<div style={[styles.pubSectionWrapper, styles.featuredPubWrapper]}>
						<div style={styles.sectionTitle}>Featured Pubs</div>
						<div style={styles.sectionText}>Pubs curated by your journal</div>

						{
							this.props.journalData.featuredPubs && this.props.journalData.featuredPubs.length
								? 'Got em!'
								: <div style={styles.emptyBlock}>No Featured Pubs</div>
						}
					</div>
					<div style={[styles.pubSectionWrapper]}>
						<div style={styles.sectionTitle}>Submitted Pubs</div>
						<div style={styles.sectionText}>Pubs submitted to your journal for consideration</div>
						{
							this.props.journalData.submittedPubs && this.props.journalData.submittedPubs.length
								? 'Got em!'
								: <div style={styles.emptyBlock}>No Pending Submitted Pubs</div>
						}
					</div>
					<div style={globalStyles.clearFix}></div>
				</div>
				
			</div>
		);
	}
});

export default Radium(JournalCurate);

styles = {
	pubSectionsWrapper: {
		margin: '30px 0px',
		display: 'table',
		width: '100%',
	},
	pubSectionWrapper: {
		width: '50%',
		display: 'table-cell',
	},
	featuredPubWrapper: {
		width: 'calc(50% - 1px)',
		borderRight: '1px solid #EAEAEA',
	},
	sectionTitle: {
		textAlign: 'center',
		fontSize: 20,
	},
	sectionText: {
		textAlign: 'center',
		fontSize: 16,
		marginBottom: '15px'
	},
	emptyBlock: {
		backgroundColor: '#f6f6f6',
		width: '75%',
		margin: '0px auto',
		height: '85px',
		lineHeight: '85px',
		textAlign: 'center',
		border: '1px solid rgba(0,0,0,0.05)',
		borderRadius: '2px',
	}

};

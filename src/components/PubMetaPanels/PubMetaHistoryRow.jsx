import React, { PropTypes } from 'react';
import Radium from 'radium';
import dateFormat from 'dateformat';
import { Link } from 'react-router';
// import {globalStyles} from '../../utils/styleConstants';

// import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const PubMetaHistoryRow = React.createClass({
	propTypes: {
		historyItem: PropTypes.object,
		diffItem: PropTypes.object,
		index: PropTypes.number,
		slug: PropTypes.string
	},

	getDefaultProps: function() {
		return {
			historyItem: {
				diffObject: {},
			},
		};
	},

	render: function() {
		const diffObject = this.props.historyItem.diffObject || {};
		return (
			<div style={[styles.container, this.props.index === 0 && styles.noBottomBorder]}>

				<div style={styles.versionDetails}>
					<div style={styles.versionTitleLine}>
						<span style={styles.versionNumber}>{this.props.index + 1}.</span>
						{/* <span style={styles.versionStatus}>{this.props.historyItem.status === 'Draft' 
							? <FormattedMessage id="pub.draftVersion" defaultMessage="Draft Version"/>
							: <FormattedMessage {...globalMessages.ReadyForPeerReview} />
						}</span> */}
						<span style={styles.versionDate}>{dateFormat(this.props.historyItem.publishDate, 'mmm dd, yyyy h:MMTT')}</span>
					</div>

					<div style={styles.versionChangesLine}>
						<span style={styles.additions}>{diffObject.additions} <FormattedMessage id="pub.additions" defaultMessage="additions"/></span> 
						<span style={styles.changeCountSeparator}>|</span> 
						<span style={styles.deletions}>{diffObject.deletions} <FormattedMessage id="pub.deletions" defaultMessage="deletions"/></span>
					</div>

					<div style={styles.versionMessage}>
						{this.props.historyItem.publishNote}
					</div>
				</div>

				<div style={styles.versionButtons}>
					<div style={styles.versionButtons}>
						<Link style={styles.link} to={'/pub/' + this.props.slug + '/historydiff?version=' + (this.props.index + 1)}><div key={'historyRowViewButton-' + this.props.index} style={styles.historyButton}>
							<FormattedMessage id="pub.viewChanges" defaultMessage="View Changes"/>
						</div></Link>
						<Link style={styles.link} to={'/pub/' + this.props.slug + '?version=' + (this.props.index + 1)}><div key={'historyRowReadButton-' + this.props.index} style={styles.historyButton}>
							<FormattedMessage id="pub.readAtThisPoint" defaultMessage="Read pub at this point"/>
						</div></Link>
					</div>
				</div>
					
					
				<div style={styles.clearFix}></div>
							
			</div>
		);
	}
});

export default Radium(PubMetaHistoryRow);

styles = {
	container: {
		paddingBottom: 30,
		marginBottom: 30,
		borderBottom: '1px solid #ccc',
	},
	link: {
		textDecoration: 'none',
	},
	noBottomBorder: {
		borderBottom: '0px solid #ccc',
		marginBottom: 0,
	},
	clearFix: {
		display: 'table',
		clear: 'both',
	},

	versionDetails: {
		width: 'calc(100% - 175px)',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
			width: '100%',
		}
	},
	versionButtons: {
		width: 175,
		float: 'left',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
			width: '100%',
		}
	},

	versionTitleLine: {
		fontFamily: 'Courier',
		color: '#555',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '20px',
		}
	},
	versionChangesLine: {
		paddingLeft: 40
	},
	versionMessage: {
	
		padding: '15px 15px 0px 40px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '15px 15px 30px 40px',
			fontSize: '20px',
		}
	},
	versionNumber: {
		width: 40,
		display: 'inline-block',
		fontSize: '16px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '20px',
		}
	},
	versionStatus: {
		paddingRight: 10,
		fontSize: '16px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '20px',
		}
	},
	versionDate: {
		fontSize: '16px',
		// color: '#666',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			paddingLeft: 40,
			fontSize: '20px',
		}
	},
	additions: {
		fontSize: '14px',
		color: 'rgba(79, 192, 79, 1.0)',
		fontFamily: 'Courier',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			fontSize: '18px',
		}
	},
	deletions: {
		fontSize: '14px',
		color: 'rgba(245,105,105,1.0)',
		fontFamily: 'Courier',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			fontSize: '18px',
		}
	},
	changeCountSeparator: {
		display: 'inline-block',
		width: 20,
		textAlign: 'center',
		color: '#ccc',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},
	historyButton: {
		textAlign: 'right',
		fontSize: '14px',
		color: '#888',
		paddingTop: 5,
		':hover': {
			cursor: 'pointer',
			color: 'black',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			paddingTop: 15,
			fontSize: '22px',
			textAlign: 'center'
		}
	}

};

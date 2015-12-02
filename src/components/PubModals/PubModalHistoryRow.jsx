import React, { PropTypes } from 'react';
import Radium from 'radium';
import dateFormat from 'dateformat';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubModalHistoryRow = React.createClass({
	propTypes: {
		historyItem: PropTypes.object,
		diffItem: PropTypes.object,
		index: PropTypes.number,

	},

	getDefaultProps: function() {
		return {
			historyItem: {},
		};
	},

	render: function() {
		return (
			<div style={styles.container}>

				<div style={styles.versionDetails}>
					<div style={styles.versionTitleLine}>
						<span style={styles.versionNumber}>{this.props.index + 1}.</span>
						<span style={styles.versionStatus}>{this.props.historyItem.status === 'draft' ? 'Draft Version' : 'Peer-Review Ready'}</span>
						<span style={styles.versionDate}>{dateFormat(this.props.historyItem.publishDate, 'mm/dd/yy, h:MMTT')}</span>
					</div>

					<div style={styles.versionChangesLine}>
						<span style={styles.additions}>14,000 additions</span> 
						<span style={styles.changeCountSeparator}>|</span> 
						<span style={styles.deletions}>27,000 deletions</span>
					</div>

					<div style={styles.versionMessage}>
						{this.props.historyItem.publishNote}
					</div>
				</div>

				<div style={styles.versionButtons}>
					<div style={styles.versionButtons}>
						<div key={'historyRowViewButton-' + this.props.index} style={styles.historyButton}>View Changes</div>
						<div key={'historyRowReadButton-' + this.props.index} style={styles.historyButton}>Read pub at this point</div>
					</div>
				</div>
					
					
				<div style={styles.clearFix}></div>
							
			</div>
		);
	}
});

export default Radium(PubModalHistoryRow);

styles = {
	container: {
		paddingBottom: 30,
		marginBottom: 30,
		borderBottom: '1px solid #ccc',
	},
	clearFix: {
		display: 'table',
		clear: 'both',
	},

	versionDetails: {
		width: 'calc(100% - 175px)',
		float: 'left',
	},
	versionButtons: {
		width: 175,
		float: 'left'
	},

	versionTitleLine: {
		fontFamily: 'Courier',
		color: '#555',
		// backgroundColor: 'rgba(255,0,20,0.1)',
	},
	versionChangesLine: {
		paddingLeft: 30
		// backgroundColor: 'rgba(100,100,20,0.1)',
	},
	versionMessage: {
	
		padding: '15px 15px 0px 30px',
		// backgroundColor: 'rgba(255,255,20,0.1)',
	},
	// versionButtons: {
	// 	paddingLeft: 30
	// },
	versionNumber: {
		width: 30,
		display: 'inline-block',
		fontSize: '16px',
	},
	versionStatus: {
		paddingRight: 10,
		fontSize: '16px',
	},
	versionDate: {
		fontSize: '12px',
		color: '#666',
	},
	additions: {
		fontSize: '14px',
		color: 'green',
		fontFamily: 'Courier'
	},
	deletions: {
		fontSize: '14px',
		color: 'red',
		fontFamily: 'Courier'
	},
	changeCountSeparator: {
		display: 'inline-block',
		width: 20,
		textAlign: 'center',
		color: '#ccc',
	},
	historyButton: {
		// float: 'left',
		// width: '50%',
		// textAlign: 'center',
		textAlign: 'right',
		fontSize: '14px',
		color: '#888',
		paddingTop: 5,
		':hover': {
			cursor: 'pointer',
			color: 'black',
		}
	}

};

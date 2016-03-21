import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
// import { Link } from 'react-router';

let styles = {};

const JournalPreview = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		displayType: PropTypes.string, // 'line' or 'block'
		headerFontSize: PropTypes.string,
		hideDetails: PropTypes.bool,
		customDetails: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			displayType: 'line',
			customDetails: [],
		};
	},

	render: function() {
		const journal = this.props.journalData;
		const journalURL = journal.customDomain ? 'http://' + journal.customDomain : 'http://' + journal.subdomain + '.pubpub.org';
		const journalStyle = {
			backgroundColor: journal.design && journal.design.landingHeaderBackground, 
			color: journal.design && journal.design.landingHeaderText,
			':hover': {
				color: journal.design && journal.design.landingHeaderHover,
			},
		};
		return (
			<div style={[styles.container]} >

				<a style={globalStyles.link} href={journalURL}>

					<div key={'userBlock-' + journal._id} style={[styles.journalBlock, journalStyle]}>
						<div style={styles.journalName}>{journal.journalName}</div>
						<div style={[styles.details, this.props.hideDetails && {display: 'none'} ]}>
							<span>{(journal.pubsFeatured && journal.pubsFeatured.length) || 0} Pubs</span>
							<span style={styles.separator}> | </span>
							<span>{(journal.colletctions && journal.collections.length) || 0} Collections</span>
						</div>

						{this.props.customDetails.map((detail, index)=>{
							return (
								<div style={[styles.details]} key={'customDetail-' + index}>
									{detail}
								</div>
							);
						})}
						
					</div>
				</a>

			</div>
		);
	}
});

export default Radium(JournalPreview);

styles = {
	container: {
		width: '100%',
	},
	journalBlock: {
		padding: '5px',
		color: '#999',
		// ':hover': {
		// 	// color: 'black',
		// 	boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 0.85)',
		// },
	},
	journalName: {
		fontSize: '25px',
	},
	details: {
		fontSize: '16px',
		width: '100%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	separator: {
		padding: '0px 10px',
	},
};

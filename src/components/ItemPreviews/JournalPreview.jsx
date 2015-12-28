import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
// import { Link } from 'react-router';

let styles = {};

const JournalPreview = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		displayType: PropTypes.string, // 'line' or 'block'
		headerFontSize: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			displayType: 'line' 
		};
	},

	render: function() {
		const journal = this.props.journalData;
		const journalURL = journal.customDomain ? 'http://' + journal.customDomain : 'http://' + journal.subdomain + '.pbpb.co';
		return (
			<div style={[styles.container]} >

				<a style={globalStyles.link} href={journalURL}>

					<div key={'userBlock-' + journal._id} style={[styles.journalBlock]}>
						<div style={styles.journalName}>{journal.journalName}</div>
						<div style={styles.details}>
							<span>{(journal.pubsFeatured && journal.pubsFeatured.length) || 0} Pubs</span>
							<span style={styles.separator}> | </span>
							<span>{(journal.collections && journal.collections.length) || 0} Collections</span>
						</div>
						
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
		':hover': {
			color: 'black',
		},
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

import React, {PropTypes} from 'react';
import Radium from 'radium';
import {GalleryCollection, GalleryPub, GalleryUser} from 'components';
// import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const JournalMain = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			journalData: {},
		};
	},

	render: function() {
		return (
			<div style={styles.container}>

				<div style={styles.sectionHeader}>
					<FormattedMessage {...globalMessages.pubs} />
				</div>
				<GalleryPub pubs={this.props.journalData.pubsFeatured} />

				<div style={styles.sectionHeader}>
					<FormattedMessage {...globalMessages.collections} />
				</div>
				<GalleryCollection collections={this.props.journalData.collections} />

				<div style={styles.sectionHeader}>
					<FormattedMessage {...globalMessages.admins} />
				</div>
				<GalleryUser users={this.props.journalData.admins} />

			</div>
		);
	}
});

export default Radium(JournalMain);

styles = {
	sectionHeader: {
		fontSize: '25px',
		margin: '15px 0px',
	},
};

import React, {PropTypes} from 'react';
import Radium from 'radium';
import {CollectionGallery, PubGallery, UserGallery} from '../';
// import {globalStyles} from '../../utils/styleConstants';

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

				<div style={styles.sectionHeader}>Pubs</div>
				<PubGallery pubs={this.props.journalData.pubs} />

				<div style={styles.sectionHeader}>Collections</div>
				<CollectionGallery collections={this.props.journalData.collections} />

				<div style={styles.sectionHeader}>Admins</div>
				<UserGallery users={this.props.journalData.admins} />

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

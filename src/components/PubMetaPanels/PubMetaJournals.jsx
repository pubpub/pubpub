import React, { PropTypes } from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubMetaExperts = React.createClass({
	propTypes: {
		featuredIn: PropTypes.array,
		featuredInList: PropTypes.array,
		submittedTo: PropTypes.array,
		submittedToList: PropTypes.array,
		handleSubmitToJournal: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			featuredIn: [],
			featuredInList: [],
			submittedTo: [],
			submittedToList: [],
		};
	},

	render: function() {
		return (
			<div style={styles.container}>

					HOURNALSDAD
					
			</div>
		);
	}
});

export default Radium(PubMetaExperts);

styles = {
	container: {
		padding: 15,
	},
};

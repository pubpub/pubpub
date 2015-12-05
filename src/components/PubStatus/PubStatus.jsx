import React, {PropTypes} from 'react';
import Radium from 'radium';
// import Markdown from 'react-remarkable';
// import {globalStyles} from '../../utils/styleConstants';
import {rightBarStyles} from '../../containers/PubReader/rightBarStyles';
// import dateFormat from 'dateformat';

let styles = {};

const PubStatus = React.createClass({
	propTypes: {
		discussionData: PropTypes.object,
	},

	render: function() {
		const pubData = {featuredIn: [], submittedTo: []};
		return (
			<div style={styles.container}>
				
				<div className="pub-status-wrapper" style={rightBarStyles.sectionWrapper}>
					<div style={rightBarStyles.sectionHeader}>Status: {pubData.status}</div>
					<div style={rightBarStyles.sectionSubHeader}>Featured in {pubData.featuredIn.length}  |  Submitted to {pubData.submittedTo.length}</div>
				</div>
				
			</div>
		);
	}
});

export default Radium(PubStatus);

styles = {
	
};

import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';
import {rightBarStyles} from '../../containers/PubReader/rightBarStyles';

let styles = {};

const PubStatus = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		pubStatus: PropTypes.string,
		featuredIn: PropTypes.array,
		submittedTo: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			featuredIn: [],
			submittedTo: [],
		};
	},

	render: function() {
		// const pubData = {featuredIn: [], submittedTo: []};
		return (
			<div style={styles.container}>
				
				<div className="pub-status-wrapper" style={rightBarStyles.sectionWrapper}>
					<div style={rightBarStyles.sectionHeader}><span style={styles.headerPrefix}>Status:</span> {this.props.pubStatus === 'Draft' ? 'Draft' : 'Peer-Review Ready'}</div>
					<Link to={'/pub/' + this.props.slug + '/reviews'} style={globalStyles.link}><div style={rightBarStyles.sectionSubHeader}>Featured in {this.props.featuredIn.length} Journals |  Submitted to {this.props.submittedTo.length} Journals</div></Link>
				</div>
				
			</div>
		);
	}
});

export default Radium(PubStatus);

styles = {
	headerPrefix: {
		paddingRight: 10,
	},
};

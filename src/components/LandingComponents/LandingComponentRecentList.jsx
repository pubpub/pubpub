import React, { PropTypes } from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';
import {PubGallery} from '../';
// import { Link } from 'react-router';
// const HoverLink = Radium(Link);

// import {globalMessages} from '../../utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const LandingComponentRecentList = React.createClass({
	propTypes: {
		style: PropTypes.object,
		recentPubs: PropTypes.array,
		
	},

	render: function() {		
		this.props.recentPubs.sort(function(pubA, pubB) { 
			return new Date(pubB.lastUpdated).getTime() - new Date(pubA.lastUpdated).getTime();
		});

		return (
			<div style={[styles.container, this.props.style]}>
				<PubGallery pubs={this.props.recentPubs} />
			</div>
		);
	}
});

export default Radium(LandingComponentRecentList);

styles = {
	container: {
		width: 'calc(100% - 60px)',
		padding: '10px 30px',
		// backgroundColor: 'transparent',
		color: '#888',
	},
	
};

import React, { PropTypes } from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import {CollectionGallery} from '../../components';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const LandingComponentCollectionList = React.createClass({
	propTypes: {
		style: PropTypes.object,
		collections: PropTypes.array,
	},

	getInitialState() {
		return {
			
		};
	},

	render: function() {
		
		return (this.props.collections && this.props.collections.length
			? <div style={[styles.container, this.props.style]}>
				<div>
					<div style={styles.header}>
						<FormattedMessage {...globalMessages.collections} />
					</div>
					<CollectionGallery collections={this.props.collections} />
				</div>
				<div style={globalStyles.clearFix}></div>
			</div>
			: <div style={styles.noCollectionsWrapper}>
				<div style={styles.noCollectionsText}>No collections yet</div>
			</div>
		
		);
	}
});

export default Radium(LandingComponentCollectionList);

styles = {
	container: {
		
	},
	noCollectionsWrapper: {
		margin: '20px auto',
		width: '60%',
		backgroundColor: '#eee',
		textAlign: 'center',
	},
	noCollectionsText: {
		fontSize: '20px',
		padding: '30px 0px',
		color: '#555',
	},
	header: {
		fontSize: '35px',
	},

};

import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';
import {PubPreview} from '../../components/ItemPreviews';

let styles = {};

const CollectionGallery = React.createClass({
	propTypes: {
		collections: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			collections: [],
		};
	},

	render: function() {
		return (
			<div style={styles.container}>
				{JSON.stringify(this.props.collections)}
			</div>
		);
	}
});

export default Radium(CollectionGallery);

styles = {
	
};

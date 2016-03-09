import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import {CollectionPreview} from '../../components/ItemPreviews';

let styles = {};

export const CollectionGallery = React.createClass({
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
				{
					this.props.collections.map((collection, index)=>{
						return (
							<div style={styles.previewWrapper} key={'CollectionPreview-' + index}>
								<CollectionPreview collectionData={collection} />
							</div>
						);
					})
				}
				<div style={globalStyles.clearFix}></div>
			</div>
		);
	}
});

export default Radium(CollectionGallery);

styles = {
	previewWrapper: {
		margin: 20,
		width: 'calc(50% - 40px)',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 40px)',
		}
	},
};

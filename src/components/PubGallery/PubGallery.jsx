import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import {PubPreview} from '../../components/ItemPreviews';

let styles = {};

const PubGallery = React.createClass({
	propTypes: {
		pubs: PropTypes.array,
		reverseOrder: PropTypes.bool,
	},

	getDefaultProps: function() {
		return {
			pubs: [],
		};
	},

	render: function() {
		const newPubsArray = this.props.reverseOrder ? this.props.pubs.slice(0).reverse() : this.props.pubs.slice(0);

		return (
			<div style={styles.container}>
				{
					newPubsArray.map((pub, index)=>{
						return (
							<div style={styles.previewWrapper} key={'PubPreview-' + index}>
								<PubPreview pubData={pub} />
							</div>
						);
					})
				}
				<div style={globalStyles.clearFix}></div>
			</div>
		);
	}
});

export default Radium(PubGallery);

styles = {
	previewWrapper: {
		padding: 20,
		width: 'calc(100% - 40px)',
		borderBottom: '1px solid #F0F0F0',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 40px)',
		}
	},
};

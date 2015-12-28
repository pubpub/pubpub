import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import {UserPreview} from '../../components/ItemPreviews';

let styles = {};

const UserGallery = React.createClass({
	propTypes: {
		users: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			users: [],
		};
	},

	render: function() {
		return (
			<div style={styles.container}>
				{
					this.props.users.map((user, index)=>{
						return (
							<div style={styles.previewWrapper} key={'UserPreview-' + index}>
								<UserPreview userData={user} />
							</div>
						);
					})
				}
				<div style={globalStyles.clearFix}></div>
			</div>
		);
	}
});

export default Radium(UserGallery);

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

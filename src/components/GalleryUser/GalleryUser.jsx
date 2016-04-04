import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import {PreviewUser} from 'components';

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
							<div style={styles.previewWrapper} key={'PreviewUser-' + index}>
								<PreviewUser userData={user} />
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
		margin: 10,
		// width: 'calc(105px)',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// width: 'calc(170px - 20px)',
		}
	},
};

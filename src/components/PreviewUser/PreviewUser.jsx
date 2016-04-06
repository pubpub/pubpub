import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';

let styles = {};

const UserPreview = React.createClass({
	propTypes: {
		userData: PropTypes.object,
		displayType: PropTypes.string, // 'line' or 'block'
		headerFontSize: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			displayType: 'block' 
		};
	},

	render: function() {
		const user = this.props.userData;
		return (
			<div style={[styles.container]} >

				<Link style={globalStyles.link} to={'/user/' + user.username}>

					<div key={'userBlock-' + user._id} style={[styles.userBlock]}>
						<img style={styles.image} src={user.thumbnail.replace(',h_50,w_50', ',h_100,w_100')} />
						<div style={styles.name}>{user.name}</div>
					</div>
				</Link>

			</div>
		);
	}
});

export default Radium(UserPreview);

styles = {
	container: {
		width: '100%',
	},
	userBlock: {
		padding: '5px',
		width: '100px',
		color: '#999',
		':hover': {
			color: 'black',
		},
	},
	image: {
		width: '100%',
	},
	name: {
		fontSize: '16px',
		width: '100%',
		textAlign: 'center',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
};

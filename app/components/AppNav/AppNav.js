import React, { PropTypes } from 'react';
import { Link } from 'react-router';

let styles;

export const AppNav = React.createClass({
	propTypes: {
		userData: PropTypes.object,
	},

	render() {
		const user = this.props.userData || {};
		return (
			<div style={styles.container}>
				<Link to="/" style={styles.link}>
					PubPub
				</Link>

				<div style={styles.name}>{user.name}</div>
				
			</div>
		);
	}

});

export default AppNav;

styles = {
	container: {
		backgroundColor: '#232425',
		color: 'white',
		lineHeight: '50px',
		height: '50px',
		padding: '0em 1em',
		position: 'relative',
	},
	link: {
		color: 'white',
		textDecoration: 'none',
		fontFamily: 'Yrsa',
		fontSize: '1.25em',
	},
	name: {
		textAlign: 'right',
		color: '#FFF',
		position: 'absolute',
		right: '1em',
		top: 0,
		height: '50px',
		lineHeight: '55px',
		fontWeight: 'light',
	},
};

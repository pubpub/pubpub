import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const HeaderMenu = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		navData: PropTypes.object,
		color: PropTypes.string,
		hoverColor: PropTypes.string,
		loginToggle: PropTypes.func,
		menuToggle: PropTypes.func,
	},

	headerTextColorStyle: function() {
		return {
			color: this.props.color,
			':hover': {
				color: this.props.hoverColor,
			}
		};
	},

	render: function() {
		

		return (
			<div styles={styles.right}>

				<div key="headerMenuLogin" onClick={this.props.menuToggle} style={[styles.navButton, this.headerTextColorStyle()]}>
					<span>
						Menu
					</span>
				</div>

				<div className="menuDrawer" style={[
					styles.menuDrawer,
					this.props.navData.get('menuOpen') && styles.menuDrawerOpen
				]}>
					<div style={styles.closeBar} onClick={this.props.menuToggle}></div>
					<div style={styles.menuContent}>
						<ul style={styles.menuList}>
							<li style={styles.menuItem}>Login</li>
							<li style={styles.menuItem}>Table of Contents</li>
							<li style={styles.menuItem}>About</li>
							<li style={styles.menuItem}>Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens</li>
							<li style={styles.menuItem}>Squirrels</li>
							<li style={styles.menuItem}>About</li>
							<li style={styles.menuItem}>Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens</li>
							<li style={styles.menuItem}>Squirrels</li>
							<li style={styles.menuItem}>About</li>
							<li style={styles.menuItem}>Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens</li>
							<li style={styles.menuItem}>Squirrels</li>
							<li style={styles.menuItem}>About</li>
							<li style={styles.menuItem}>Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens Kittens</li>
							<li style={styles.menuItem}>Squirrels</li>
						</ul>
					</div>
				</div>
				
			</div>
		);
	}
});

export default Radium(HeaderMenu);

styles = {
	right: {
		float: 'right',
	},
	navButton: {
		float: 'right',
		height: globalStyles.headerHeightMobile,
		lineHeight: globalStyles.headerHeightMobile,
		fontFamily: globalStyles.headerFont,
		fontSize: '1.5em',
		padding: '0px 15px 0px 25px',
		':hover': {
			cursor: 'pointer',
		}
	},
	menuDrawer: {
		width: '100vw',
		height: 'calc(100vh - ' + globalStyles.headerHeightMobile + ')',
		// backgroundColor: 'rgba(255,0,190,0.2)',
		position: 'absolute',
		top: 60,
		right: 0,
		transition: '.2s ease-in-out transform',
		transform: 'translateX(105%)',
	},
	menuDrawerOpen: {
		transform: 'translateX(0%)',
	},
	closeBar: {
		float: 'left',
		width: '10%',
		height: '100%',
		// backgroundColor: 'rgba(255,0,190,0.2)',
	},
	menuContent: {
		float: 'left',
		width: '90%',
		height: '100%',
		overflowY: 'scroll',
		backgroundColor: globalStyles.sideBackground,
		boxShadow: '0px 3px 4px 2px rgba(0,0,0,0.5)',
		color: globalStyles.headerBackground,

	},
	menuList: {
		listStyle: 'none',
		margin: 0,
		padding: 0,
	},
	menuItem: {
		textAlign: 'left',
		fontSize: '2em',
		width: 'calc(100% - 80px)',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		padding: '20px 40px',
		fontFamily: globalStyles.headerFont,
	},
	loggedOut: {
		true: {
			display: 'none',
		}
	},
	loggedIn: {
		false: {
			display: 'none',
		}
	},
};

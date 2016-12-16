import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);
let styles = {};

export const NavContentWrapper = React.createClass({
	propTypes: {
		navItems: PropTypes.array,
		mobileNavButtons: PropTypes.array,
		children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])

	},

	getInitialState() {
		return {
			showMenu: false,
		};
	},
	toggleMenu: function() {
		this.setState({showMenu: !this.state.showMenu});
	},

	closeMenu: function() {
		this.setState({showMenu: false});
	},

	render: function() {
		const navItems = this.props.navItems || [];
		const mobileNavButtons = this.props.mobileNavButtons || [];

		return (
			<div style={styles.contentSection}>
				<div style={styles.contentNav}>

					<div style={styles.contentNavMobileButtons}>
						{mobileNavButtons.slice(0, 2).map((option, index)=>{

							if (option.type === 'link') {
								return <Link key={'navItem-' + index} style={styles.contentNavLinkMobile} to={option.link} onClick={this.closeMenu}>{option.text}</Link>;
							}
							if (option.type === 'button') {
								return <div key={'navItem-' + index} style={styles.contentNavLinkMobile} onClick={option.action || this.toggleMenu}>{option.text}</div>;
							}

						})}
						<div style={styles.contentNavMobileButtonSeparator} />
					</div>

					<div style={[styles.contentNavItems, !this.state.showMenu && styles.hideOnMobile]}>
						{navItems.map((option, index)=>{

							if (option.type === 'link') {
								return <Link key={'navItem-' + index} className={'verticalNavHover'} style={[styles.contentNavLink, option.active && styles.contentNavLinkActive]} to={option.link} onClick={this.closeMenu}>{option.text}</Link>;
							}
							if (option.type === 'button') {
								return <div key={'navItem-' + index} className={'verticalNavHover'} style={[styles.contentNavLink, option.active && styles.contentNavLinkActive]} onClick={option.action || this.closeMenu}>{option.text}</div>;
							}
							if (option.type === 'spacer') {
								return <div key={'navItem-' + index} style={styles.contentNavSpacer}></div>;
							}
							if (option.type === 'title') {
								return <div key={'navItem-' + index} style={[styles.contentNavLink, styles.contentNavTitle]}>{option.text}</div>;
							}


						})}
					</div>
					
				</div>

				<div style={styles.contentBody}>
					{this.props.children}		
				</div>
			</div>
		);
	}
});

export default Radium(NavContentWrapper);

styles = {
	contentSection: {
		padding: '0em 2em 3em 2em',
		margin: '0 auto',
		maxWidth: '1024px',

		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		}
	},
	contentNav: {
		whiteSpace: 'nowrap',
		display: 'table-cell',
		verticalAlign: 'top',
		width: '1%',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			fontSize: '1.2em',
			width: 'calc(100% + 2em / 1.2)', // This is to offset the padding implied by .section
			position: 'relative',
			left: 'calc(-1em / 1.2)',
		}
	},
	contentBody: {
		display: 'table-cell',
		verticalAlign: 'top',
		paddingLeft: '1em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			paddingLeft: '0em',
			paddingTop: '2em', // This matches the top offset defined by .section
		}
	},
	contentNavMobileButtons: {
		position: 'relative',
	},
	contentNavMobileButtonSeparator: {
		width: '1px',
		height: '60%',
		backgroundColor: '#BBBDC0',
		position: 'absolute',
		right: '50%',
		top: '20%',
	},
	contentNavItems: {
		padding: '0em 0em 1em 0em',
		borderRight: '1px solid #BBBDC0',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			boxShadow: 'inset 0px -4px 6px -4px #BBBDC0',
			padding: '1em 0em',
			backgroundColor: '#F3F3F4',
			borderRight: '0px solid #BBBDC0',
		}
	},
	contentNavLink: {
		display: 'block',
		textDecoration: 'none',
		color: 'inherit',
		padding: '.15em 2em .15em .5em',
		cursor: 'pointer',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '150px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '.2em 1em',
			fontSize: '1em',
		}
	},
	contentNavTitle: {
		color: '#808284',
		cursor: 'default',
		padding: '.15em 2em .15em 0em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '.2em 1em .2em .25em',
		}
	},
	contentNavLinkActive: {
		padding: '.15em 2em .15em calc(.5em - 3px)',
		borderLeft: '3px solid #2C2A2B',
	},
	contentNavLinkMobile: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			textDecoration: 'none',
			color: 'inherit',
			display: 'inline-block',
			width: '50%',
			textAlign: 'center',
			cursor: 'pointer',
			padding: '1em 0px',
			borderWidth: '1px 0px 1px 0px',
			borderColor: '#BBBDC0',
			borderStyle: 'solid',
			position: 'relative',
			userSelect: 'none',
		}
	},
	contentNavSpacer: {
		height: '1em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '.2em 1em',
		}
	},
	hideOnMobile: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},

};

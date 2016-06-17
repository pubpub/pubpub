import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);
let styles = {};

export const NavContentWrapper = React.createClass({
	propTypes: {
		navItems: PropTypes.array,
		mobileNavButtons: PropTypes.array,
		hideRightBorder: PropTypes.bool,
		children: PropTypes.object
	},

	getInitialState() {
		return {
			showMenu: false,
		};
	},
	toggleMenu: function() {
		this.setState({showMenu: !this.state.showMenu});
	},

	render: function() {
		const navItems = this.props.navItems || [];
		const mobileNavButtons = this.props.mobileNavButtons || [];
		const hideRightBorder = this.props.hideRightBorder;

		return (
			<div className={'section'} style={styles.contentSection}>
				<div style={styles.contentNav}>

					<div style={styles.contentNavMobileButtons}>
						{mobileNavButtons.slice(0, 2).map((option, index)=>{

							if (option.type === 'link') {
								return <Link key={'navItem-' + index} style={styles.contentNavLinkMobile} to={option.link} onClick={this.toggleMenu}>{option.text}</Link>;
							}
							if (option.type === 'button') {
								return <div key={'navItem-' + index} style={styles.contentNavLinkMobile} onClick={option.action || this.toggleMenu}>{option.text}</div>;
							}

						})}
						<div style={styles.contentNavMobileButtonSeparator}></div>
					</div>

					<div style={[styles.contentNavItems, !hideRightBorder && styles.contentNavItemsRightBorder, !this.state.showMenu && styles.hideOnMobile]}>
						{navItems.map((option, index)=>{

							if (option.type === 'link') {
								return <Link key={'navItem-' + index} className={'lighter-bg-hover'} style={[styles.contentNavLink, option.active && styles.contentNavLinkActive]} to={option.link} onClick={this.toggleMenu}>{option.text}</Link>;
							}
							if (option.type === 'button') {
								return <div key={'navItem-' + index} className={'lighter-bg-hover'} style={[styles.contentNavLink, option.active && styles.contentNavLinkActive]} onClick={option.action || this.toggleMenu}>{option.text}</div>;
							}
							if (option.type === 'spacer') {
								return <div key={'navItem-' + index} style={styles.contentNavSpacer}></div>;
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
		paddingTop: '0em',
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
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			boxShadow: 'inset 0px -4px 6px -4px #BBBDC0',
			padding: '1em 0em',
			backgroundColor: '#F3F3F4',
		}
	},
	contentNavItemsRightBorder: {
		borderRight: '1px solid #BBBDC0',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			borderRight: '0px solid #BBBDC0',
		}
	},
	contentNavLink: {
		display: 'block',
		textDecoration: 'none',
		color: 'inherit',
		padding: '.15em 2em .15em .15em',
		fontSize: '0.9em',
		cursor: 'pointer',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '.2em 1em',
			fontSize: '1em',
		}
	},
	contentNavLinkActive: {
		backgroundColor: '#BBBDC0',
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

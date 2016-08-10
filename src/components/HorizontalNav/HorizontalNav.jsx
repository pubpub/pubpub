import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);

let styles = {};

export const HorizontalNav = React.createClass({
	propTypes: {
		navItems: PropTypes.array,
		mobileNavButtons: PropTypes.array,
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
		const leftNavItems = navItems.filter((item)=>{ return item.rightAlign !== true; });
		const rightNavItems = navItems.filter((item)=>{ return item.rightAlign === true; });
		const mobileNavButtons = this.props.mobileNavButtons || [];

		return (
			<div className={'horizontal-nav'} style={styles.pubSectionNav}>
				<div style={styles.contentNavMobileButtons}>
					{mobileNavButtons.slice(0, 2).map((option, index)=>{

						if (option.type === 'link') {
							return <Link key={'navItem-' + index} style={styles.contentNavLinkMobile} to={option.link} onClick={this.closeMenu}>{option.text}</Link>;
						}
						if (option.type === 'button') {
							return <div key={'navItem-' + index} style={styles.contentNavLinkMobile} onClick={option.action || this.toggleMenu}>{option.text}</div>;
						}

					})}
					<div style={styles.contentNavMobileButtonSeparator}></div>
				</div>

				<div style={[styles.contentNavItems, !this.state.showMenu && styles.hideOnMobile]}>

					{/* Need some indicator to show if this version is public or not */}
					{leftNavItems.map((item, index)=>{
						if (item.link) {
							return <Link to={item.link} style={[styles.pubNavButton, item.active && styles.pubNavButtonActive]} key={'leftNav-' + index} className={'horizontalNavHover'}>{item.text}</Link>;
						}
						if (item.action) {
							return <div onClick={item.action} style={[styles.pubNavButton, item.active && styles.pubNavButtonActive]} key={'leftNav-' + index} className={'horizontalNavHover'}>{item.text}</div>;
						}
					})}
					
					<div style={styles.pubNavButtonsRight}>
						{rightNavItems.map((item, index)=>{
							if (item.link) {
								return <Link to={item.link} style={[styles.pubNavButton, item.active && styles.pubNavButtonActive]} key={'rightNav-' + index} className={'horizontalNavHover'}>{item.text}</Link>;
							}
							if (item.action) {
								return <div onClick={item.action} style={[styles.pubNavButton, item.active && styles.pubNavButtonActive]} key={'rightNav-' + index} className={'horizontalNavHover'}>{item.text}</div>;
							}
							
						})}	
					</div>
				</div>
				
			</div>
		);
	}
});

export default Radium(HorizontalNav);

styles = {
	pubSectionNav: {
		// borderBottom: '1px solid #F3F3F4',
		borderBottom: '1px solid #BBBDC0',
		fontSize: '0.85em',
		color: '#808284',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% + 2em)',
			position: 'relative',
			left: '-1em',
			fontSize: '1em',
			color: 'inherit',
		}
		
	},
	pubNavButtonsRight: {
		float: 'right',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
		}
	},
	pubNavButton: {
		display: 'inline-block',
		padding: '10px',
		color: 'inherit',
		textDecoration: 'none',
		userSelect: 'none',
		cursor: 'pointer',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '.2em 1em',
			fontSize: '1em',
			display: 'block',
		}
	},
	pubNavButtonActive: {
		borderBottom: '2px solid #2C2A2B',
		padding: '10px 10px 8px 10px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '.15em 2em .15em calc(.5em - 3px)',
			borderLeft: '3px solid #2C2A2B',
			borderBottom: '0px solid #2C2A2B',
		}
	},
	contentNavItems: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			boxShadow: 'inset 0px -4px 6px -4px #BBBDC0',
			padding: '1em 0em',
			backgroundColor: '#F3F3F4',
			borderRight: '0px solid #BBBDC0',
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
	hideOnMobile: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},

};

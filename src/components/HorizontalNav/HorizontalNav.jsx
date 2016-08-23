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
			itemsToShow: 6,
			randomKey: undefined,
		};
	},

	componentWillMount: function() {
		// Generate randomKey for the case when there are multiple HorizontalNav components. We want the document.getElements to be properly specific
		this.setState({randomKey: Math.random()});
	},

	componentDidMount: function() {
		window.addEventListener('resize', this.handleResize);
		setTimeout(()=>{
			this.handleResize();
		}, 100);
		
	},

	componentWillUnmount: function() {
		window.removeEventListener('resize', this.handleResize);
	},

	handleResize: function() {
		const navWidth = document.getElementsByClassName('horizontal-nav ' + this.state.randomKey)[0].offsetWidth;
		const moreWidth = document.getElementsByClassName('more-button').length && document.getElementsByClassName('more-button')[0].offsetWidth;
		const navItems = document.getElementsByClassName('ghostButton ' + this.state.randomKey);

		let setItemsToShow = false;
		for (let index = 0; index < navItems.length; index++) {
			const itemEndWidth = navItems[index].offsetWidth + navItems[index].offsetLeft;
			const allowedWidth = index === navItems.length - 1 ? navWidth : navWidth - moreWidth; // Don't count the 'More' button when calculating for last item.
			if (itemEndWidth > allowedWidth) {
				this.setState({itemsToShow: index});
				setItemsToShow = true;
				break;
			}
		}

		if (!setItemsToShow) { 
			this.setState({itemsToShow: 100});
		}	
	},

	toggleMenu: function() {
		this.setState({showMenu: !this.state.showMenu});
	},

	closeMenu: function() {
		this.setState({showMenu: false});
	},

	render: function() {
		const navItems = this.props.navItems || [];
		const visibleNavItems = navItems.slice(0, this.state.itemsToShow);
		const collapsedNavItems = navItems.slice(this.state.itemsToShow, navItems.length);

		const mobileNavButtons = this.props.mobileNavButtons || [];
		return (
			<div className={'horizontal-nav ' + this.state.randomKey} style={styles.pubSectionNav}>
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


				<div className={'horizontal-nav-items'} style={[styles.contentNavItems, !this.state.showMenu && styles.hideOnMobile]}>
					{/* Need some indicator to show if this version is public or not */}
					{visibleNavItems.map((item, index)=>{
						if (item.link) {
							return <Link to={item.link} style={[styles.pubNavButton, item.active && styles.pubNavButtonActive]} key={'leftNav-' + index} className={'horizontalNavHover'}>{item.text}</Link>;
						}
						if (item.action) {
							return <div onClick={item.action} style={[styles.pubNavButton, item.active && styles.pubNavButtonActive]} key={'leftNav-' + index} className={'horizontalNavHover'}>{item.text}</div>;
						}
					})}

					{!!collapsedNavItems.length &&
						<div className={'showChildOnHover more-button'} style={[styles.pubNavButton]}>
							More
							<div className={'hoverChild arrow-box'} style={styles.collapsedItems}>
								{collapsedNavItems.map((item, index)=>{
									if (item.link) {
										return <Link to={item.link} style={[styles.pubNavButtonCollapsed, item.active && styles.pubNavButtonCollapsedActive]} key={'collapsed-' + index} className={'verticalNavHover'}>{item.text}</Link>;
									}
									if (item.action) {
										return <div onClick={item.action} style={[styles.pubNavButtonCollapsed, item.active && styles.pubNavButtonCollapsedActive]} key={'collapsed-' + index} className={'verticalNavHover'}>{item.text}</div>;
									}
								})}
							</div>

						</div>
					}
					
					
				</div>

				<div className={'horizontal-nav-items'} style={[styles.ghostButtons, !this.state.showMenu && styles.hideOnMobile]}>
					{/* Need some indicator to show if this version is public or not */}
					{navItems.map((item, index)=>{
						if (item.link) {
							return <Link to={item.link} style={[styles.pubNavButton, item.active && styles.pubNavButtonActive]} key={'ghost-' + index} className={'ghostButton ' + this.state.randomKey}>{item.text}</Link>;
						}
						if (item.action) {
							return <div onClick={item.action} style={[styles.pubNavButton, item.active && styles.pubNavButtonActive]} key={'ghost-' + index} className={'ghostButton ' + this.state.randomKey}>{item.text}</div>;
						}
					})}
					
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
		color: '#363736',
		margin: '0 auto',
		whiteSpace: 'nowrap',
		position: 'relative',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% + 2em)',
			position: 'relative',
			left: '-1em',
			fontSize: '1em',
			color: 'inherit',
		}
		
	},
	ghostButtons: {
		position: 'absolute',
		opacity: '0',
		pointerEvents: 'none',
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
		position: 'relative',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '.2em 1em',
			fontSize: '1em',
			display: 'block',
		}
	},
	pubNavButtonCollapsed: {
		display: 'block',
		padding: '.15em 2em .15em .5em',
	},
	collapsedItems: {
		position: 'absolute',
		right: '0',
		backgroundColor: '#F3F3F4',
		zIndex: '10',
		border: '1px solid #BBBDC0',
		padding: '1em 1.5em 1em 1em',
		top: '95%',
		boxShadow: '0px 1px 3px #BBBDC0',

	},
	pubNavButtonActive: {
		borderBottom: '2px solid #58585B',
		padding: '10px 10px 8px 10px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '.15em 2em .15em calc(.5em - 3px)',
			borderLeft: '3px solid #58585B',
			borderBottom: '0px solid #58585B',
		}
	},

	pubNavButtonCollapsedActive: {
		padding: '.15em 2em .15em calc(.5em - 3px)',
		borderLeft: '3px solid #2C2A2B',
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

import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';

/*
This is used as a base for the common left-nav
layout common throughout PubPub (profiles, settings, pub).

The styles for contentNav, contentBody, and contentSection are CSS (rather than JS) based 
so that we can more quickly edit and test layouts.
*/
export const NavContentWrapper = React.createClass({
	propTypes: {
		navItems: PropTypes.array,
		hideRightBorder: PropTypes.bool,
		children: PropTypes.object
	},

	getInitialState() {
		return {
			showMenu: false,
		};
	},
	toggleMenu: function() {
		console.log('toggle menu');
		this.setState({showMenu: !this.state.showMenu});
	},

	render: function() {
		const navItems = this.props.navItems || [];

		return (
			<div className={'section contentSection'}>
				<div className={'contentNav'}>
					{navItems.map((option, index)=>{

						let contentNavClass = option.mobile ? 'contentNavLinkMobile' : 'contentNavLink';
						contentNavClass = !option.mobile && this.state.showMenu ? contentNavClass + ' contentMenuShow' : contentNavClass;
						contentNavClass = option.active ? contentNavClass + ' contentNavLink-active' : contentNavClass;
						contentNavClass = this.props.hideRightBorder ? contentNavClass + ' contentNavNoBorder' : contentNavClass;

						let contentNavSpacerClass = this.state.showMenu ? 'contentNavSpacer contentMenuShow' : 'contentNavSpacer';
						contentNavSpacerClass = this.props.hideRightBorder ? contentNavSpacerClass + ' contentNavNoBorder' : contentNavSpacerClass;

						if (option.type === 'link') {
							return <Link key={'navItem-' + index} className={contentNavClass} to={option.link} onClick={this.toggleMenu}>{option.text}</Link>;
						}
						if (option.type === 'button') {
							return <div key={'navItem-' + index} className={contentNavClass} onClick={option.action || this.toggleMenu}>{option.text}</div>;
						}
						if (option.type === 'spacer') {
							return <span key={'navItem-' + index} className={contentNavSpacerClass}></span>;
						}

					})}
				</div>

				<div className={'contentBody'}>
					{this.props.children}		
				</div>
			</div>
		);
	}
});

export default Radium(NavContentWrapper);

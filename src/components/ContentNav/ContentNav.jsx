import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
let styles = {};

export const ContentNav = React.createClass({
	propTypes: {
		navItems: PropTypes.array,
	},

	getInitialState() {
		return {
			showMenu: false,
		};
	},
	toggleMenu: function() {
		console.log('toggle menu');
	},

	render: function() {
		const navItems = this.props.navItems || [];

		return (
			<div className={'contentNav'}>
				{navItems.map((option, index)=>{

					const contentNavClass = option.mobile ? 'contentNavLinkMobile' : 'contentNavLink';

					if (option.type === 'link') {
						return <Link key={'navItem-' + index} className={contentNavClass} to={option.link}>{option.text}</Link>;
					}
					if (option.type === 'button') {
						return <div key={'navItem-' + index} className={contentNavClass} onClick={option.action || this.toggleMenu}>{option.text}</div>;
					}
					if (option.type === 'spacer') {
						return <div key={'navItem-' + index} className={'contentNavSpacer'}></div>;
					}

				})}
			</div>
		);
	}
});

export default Radium(ContentNav);


styles = {

};

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

require('./navBar.scss');

const propTypes = {
	navItems: PropTypes.array.isRequired,
};

const NavBar = function(props) {
	return (
		<nav className={'nav-bar accent-background accent-color'}>
			<div className={'container'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<ul>
							{props.navItems.map((item)=> {
								return (
									<Link to={item.slug} key={`nav-item-${item.id}`}>
										<li>{item.title}</li>
									</Link>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

NavBar.propTypes = propTypes;
export default NavBar;

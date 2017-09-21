import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

require('./userNav.scss');

const propTypes = {
	userSlug: PropTypes.string,
	activeTab: PropTypes.string,
};

const defaultProps = {
	activeTab: undefined,
	userSlug: '',
};

const UserNav = function(props) {
	const tabs = [
		{ id: 0, label: 'Featured Pubs', path: '' },
		// { id: 1, label: 'All Pubs', path: '/pubs' },
		// { id: 2, label: 'Discussions', path: '/discussions' },
	];
	return (
		<div className={'user-nav'}>
			<div className="pt-tabs">
				<div className="pt-tab-list pt-large" role="tablist">
					{tabs.map((tab)=> {
						return (
							<Link
								key={`tab-${tab.id}`}
								to={`/user/${props.userSlug}${tab.path}`}
								className={'pt-tab'}
								role={'tab'}
								aria-selected={(tab.path.indexOf(props.activeTab) > -1 || (!tab.path && !props.activeTab)) ? 'true' : 'false'}
							>
								{tab.label}
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
};

UserNav.defaultProps = defaultProps;
UserNav.propTypes = propTypes;
export default UserNav;

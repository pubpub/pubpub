import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

require('./dashboardSide.scss');

const propTypes = {
	pages: PropTypes.array,
	collections: PropTypes.array,
	activeSlug: PropTypes.string,
};

const defaultProps = {
	pages: [],
	collections: [],
	activeSlug: undefined,
};

// Active select
// Empty set
const DashboardSide = function(props) {
	const communityControls = [
		{
			title: 'Activity',
			icon: 'pt-icon-pulse',
			slug: 'activity',
			id: 0,
		},
		{
			title: 'Site',
			icon: 'pt-icon-application',
			slug: 'site',
			id: 1,
		},
		{
			title: 'Team',
			icon: 'pt-icon-people',
			slug: 'team',
			id: 2,
		},
	];
	return (
		<div className={'dashboard-side'}>
			<div className={'content'}>
				<ul className={'pt-menu'}>
					{communityControls.map((control)=> {
						return (
							<li key={`side-control-${control.id}`}>
								<Link className={`pt-menu-item ${props.activeSlug === control.slug && 'pt-active'} ${control.icon}`} tabIndex="0" to={`/dashboard/${control.slug}`}>
									{control.title}
								</Link>
							</li>
						);
					})}

					<li className={'pt-menu-header'}>
						<button type="button" className="pt-button pt-icon-plus pt-small pt-minimal title-button" />
						<h6>Pages</h6>
					</li>
					{props.pages.map((page)=> {
						return (
							<li key={`side-page-${page.id}`}>
								<Link className={`pt-menu-item ${props.activeSlug === page.slug && 'pt-active'} ${page.isPublic ? 'pt-icon-globe' : 'pt-icon-lock'}`} tabIndex="0" to={`/dashboard/${page.slug}`}>
									{page.title}
								</Link>
							</li>
						);
					})}
					{props.pages.length === 0 &&
						<li>
							<a className={'pt-menu-item empty'}>No Pages</a>
						</li>
					}

					<li className={'pt-menu-header'}>
						<button type="button" className="pt-button pt-icon-plus pt-small pt-minimal title-button" />
						<h6>Collections</h6>
					</li>

					{props.collections.map((collection)=> {
						return (
							<li key={`side-collection-${collection.id}`}>
								<Link className={`pt-menu-item ${props.activeSlug === collection.slug && 'pt-active'} ${collection.isPublic ? 'pt-icon-globe' : 'pt-icon-lock'}`} tabIndex="0" to={`/dashboard/${collection.slug}`}>
									{collection.title}
								</Link>
							</li>
						);
					})}
					{props.collections.length === 0 &&
						<li>
							<a className={'pt-menu-item empty'}>No Collections</a>
						</li>
					}

				</ul>
			</div>
		</div>
	);
};

DashboardSide.defaultProps = defaultProps;
DashboardSide.propTypes = propTypes;
export default DashboardSide;

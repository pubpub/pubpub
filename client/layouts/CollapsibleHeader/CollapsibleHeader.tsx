import React, { useState } from 'react';
import classNames from 'classnames';

// import { AnchorButton } from '@blueprintjs/core';
// import { Icon, MobileAware, UserNotificationsPopover } from 'components';
// import UserMenu from 'components/GlobalControls/UserMenu';

import './collapsibleHeader.scss';

type NavItem = {
	url: string;
	title: string;
	isMobileOnly?: boolean;
};

type CollapsibleHeaderProps = {
	iconLinks: NavItem[];
	logo: {
		titleText: string;
		url: string;
		sourceProps: {
			srcSet: string;
			type: string;
		};
		imgProps: {
			src: string;
			alt: string;
		};
	};
	bannerNavItems: NavItem[];
	navItemGroups: NavItem[][];
};

const CollapsibleHeader = (props: CollapsibleHeaderProps) => {
	const [isMenuExpanded, setIsmenuExpanded] = useState(false);
	return (
		<div>
			<header id="siteHeader">
				<div role="banner">
					<div>
						<a href="#maincontent">Skip to Content</a>
					</div>
					<a href={props.logo.url}>
						<picture>
							<source {...props.logo.sourceProps} />
							{/* eslint-disable-next-line jsx-a11y/alt-text */}
							<img {...props.logo.imgProps} />
						</picture>
						<span>{props.logo.titleText}</span>
					</a>
				</div>
				<div role="navigation" aria-label="Main navigation">
					<div>
						<nav>
							<ul>
								<li>
									<button
										type="button"
										className="borgir"
										onClick={() => setIsmenuExpanded(true)}
									>
										Menu
									</button>
								</li>
								{props.bannerNavItems.map((item) => (
									<li key={item.title}>
										<a href={item.url}>{item.title}</a>
									</li>
								))}
							</ul>
						</nav>
					</div>
					<nav>
						<ul>
							{props.iconLinks.map((link) => (
								<li key={link.title}>
									<a href={link.url}>{link.title}</a>
								</li>
							))}
						</ul>
					</nav>
				</div>
				<div>
					<div>
						<form id="search" action="/search" method="GET">
							<fieldset>
								<label>
									<span>Search by keyword or author</span>
									<input
										type="search"
										name="for"
										value=""
										placeholder="Search by keyword or author"
									/>
								</label>
								<button type="button" name="reset">
									<span>Reset form</span>
								</button>
								<button type="submit">
									<span>Search</span>
								</button>
							</fieldset>
						</form>
					</div>
				</div>
			</header>
			<div className="main-menu" aria-expanded={isMenuExpanded}>
				<div>
					<button type="button" onClick={() => setIsmenuExpanded(false)}>
						Close
					</button>
					<div role="banner">
						<div>
							<a href="#maincontent">Skip to Content</a>
						</div>
						<a href={props.logo.url}>
							<picture>
								<source {...props.logo.sourceProps} />
								{/* eslint-disable-next-line jsx-a11y/alt-text */}
								<img {...props.logo.imgProps} />
							</picture>
							<span>{props.logo.titleText}</span>
						</a>
					</div>
				</div>
				<nav role="navigation">
					<h3>Menu</h3>
					<ul>
						{props.navItemGroups.map((itemGroup) =>
							itemGroup.map((item, idx) => {
								return (
									<li
										key={item.title}
										className={classNames([
											idx === itemGroup.length - 1 && 'end-of-group',
											item.isMobileOnly && 'hidden-wide',
										])}
									>
										<a href={item.url}>{item.title}</a>
									</li>
								);
							}),
						)}
					</ul>
					<a href="#siteHeader">Back to top</a>
				</nav>
			</div>
		</div>
	);
};

export default CollapsibleHeader;

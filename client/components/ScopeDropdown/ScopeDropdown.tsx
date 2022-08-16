import React from 'react';
import classNames from 'classnames';

import { getDashUrl } from 'utils/dashboard';
import { usePageContext } from 'utils/hooks';
import { Avatar, Icon, IconName, MenuItem } from 'components';
import { getPrimaryCollectionPub } from 'utils/collections/primary';
import { Collection, Pub } from 'types';

require('./scopeDropdown.scss');

type Scope = {
	type: string;
	icon: IconName;
	iconSize?: number;
	title: string;
	avatar: undefined | string;
	slug: string;
	href: string;
	showSettings: boolean;
};

type Props = {
	isDashboard?: boolean;
};

const getPrimaryOrFirstCollectionPub = (
	activePub: Pub | undefined,
	communityData,
): Collection | undefined => {
	if (!activePub || !activePub.collectionPubs || activePub.collectionPubs.length === 0)
		return undefined;
	const primaryOrFirstCollectionPub =
		getPrimaryCollectionPub(activePub.collectionPubs) || activePub.collectionPubs[0];
	const collection = communityData.collections.find(
		(availableCollection: Collection) =>
			primaryOrFirstCollectionPub.collectionId === availableCollection.id,
	);
	return collection;
};

const ScopeDropdown = (props: Props) => {
	const { isDashboard } = props;
	const { locationData, communityData, scopeData, pageData } = usePageContext();
	const { activeCollection, activePub } = scopeData.elements;
	const { canManageCommunity, canManage } = scopeData.activePermissions;
	const collectionSlug = locationData.params.collectionSlug || locationData.query.collectionSlug;
	const pubSlug = locationData.params.pubSlug;
	const nonActiveDashboardCollectionPub = getPrimaryOrFirstCollectionPub(
		activePub,
		communityData,
	);
	const scopes: Scope[] = [];
	scopes.push({
		type: 'Community',
		icon: 'office',
		title: communityData.title,
		avatar: communityData.avatar,
		slug: '',
		href: getDashUrl({}),
		showSettings: canManageCommunity,
	});
	if (pageData && canManageCommunity && !isDashboard) {
		scopes.push({
			type: 'Page',
			icon: 'page-layout',
			iconSize: 12,
			title: pageData.title,
			avatar: pageData.avatar,
			slug: pageData.slug || 'home',
			href: getDashUrl({ mode: 'pages', subMode: pageData.slug || 'home' }),
			showSettings: canManageCommunity,
		});
	}
	if (activeCollection) {
		scopes.push({
			type: 'Collection',
			icon: 'collection',
			title: activeCollection.title,
			avatar: activeCollection.avatar,
			slug: collectionSlug,
			href: getDashUrl({
				collectionSlug,
			}),
			showSettings: canManageCommunity,
		});
	}
	if (!activeCollection && nonActiveDashboardCollectionPub) {
		scopes.push({
			type: 'Collection',
			icon: 'collection',
			title: nonActiveDashboardCollectionPub.title,
			avatar: nonActiveDashboardCollectionPub.avatar,
			slug: nonActiveDashboardCollectionPub.slug,
			href: getDashUrl({
				collectionSlug: nonActiveDashboardCollectionPub.slug,
			}),
			showSettings: canManageCommunity,
		});
	}
	if (activePub) {
		scopes.push({
			type: 'Pub',
			icon: 'pubDoc',
			title: activePub.title,
			avatar: activePub.avatar,
			slug: pubSlug,
			href: getDashUrl({
				collectionSlug,
				pubSlug,
			}),
			showSettings: canManage,
		});
	}

	return (
		<div className={classNames('scope-dropdown-component', isDashboard && 'in-dashboard')}>
			{isDashboard && <div className="intro">Select Scope:</div>}
			<div className="scopes">
				{scopes.map((scope, index) => {
					return (
						<MenuItem
							href={scope.href}
							key={scope.type}
							text={
								<div className={`scope-item item-${index}`}>
									<div className="content">
										<div className="top">
											<Icon
												icon={scope.icon}
												iconSize={scope.iconSize || 10}
											/>
											{scope.type}
										</div>
										<div className="bottom">
											<Avatar
												avatar={scope.avatar}
												initials={scope.title[0]}
												width={18}
												isBlock={true}
											/>
											{scope.title}
										</div>
									</div>
									{scope.showSettings && scope.type !== 'Page' && (
										<div className="settings">
											<a href={`${scope.href}/settings`}>
												<Icon icon="cog" iconSize={12} />
											</a>
											<a href={`${scope.href}/members`}>
												<Icon icon="people" iconSize={12} />
											</a>
											<a href={`${scope.href}/impact`}>
												<Icon icon="dashboard" iconSize={12} />
											</a>
											{scope.type === 'Collection' && (
												<a href={`/${scope.href}/layout`}>
													<Icon icon="page-layout" iconSize={12} />
												</a>
											)}
											<a href={`/${scope.slug}`}>
												<Icon icon="globe" iconSize={12} />
											</a>
										</div>
									)}
									{scope.showSettings && scope.type === 'Page' && (
										<div className="settings">
											<a href={`/${scope.slug}`}>
												<Icon icon="globe" iconSize={12} />
											</a>
										</div>
									)}
								</div>
							}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default ScopeDropdown;

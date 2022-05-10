import { LocationData } from 'types';
import { IconName } from 'components';
import { DashboardMode, getDashUrl } from 'utils/dashboard';
import { checkMemberPermission } from 'utils/permissions';
import { pubPubIcons } from 'client/utils/icons';
import { assert } from 'utils/assert';

import { menuItemsByScopeType, MenuItem, ReadablePageContext } from './dashboardMenuItems';

type RenderedDashboardMenuItem = {
	title: string;
	icon: IconName;
	href: string;
	active: boolean;
	count: null | number;
};

type ActiveDashboardMode = {
	mode: DashboardMode;
	subMode: string | null;
};

export type DashboardMenuState = {
	menuItems: RenderedDashboardMenuItem[];
	activeMode: null | ActiveDashboardMode;
};

const getActiveDashboardMode = (locationData: LocationData): null | ActiveDashboardMode => {
	const {
		path,
		isDashboard,
		params: { subMode, reviewNumber },
	} = locationData;
	if (isDashboard) {
		const [_nothing, _dash, mode] = path.split('/');
		assert(_nothing === '' && _dash === 'dash');
		if (reviewNumber) {
			return {
				mode: 'reviews',
				subMode: reviewNumber,
			};
		}
		return {
			mode: mode as DashboardMode,
			subMode: subMode || null,
		};
	}
	return null;
};

const shouldShowMenuItemInContext = (item: MenuItem, context: ReadablePageContext) => {
	const {
		scopeData: {
			activePermissions: { activePermission },
		},
	} = context;
	const { requiredPermission, shown } = item;
	if (requiredPermission && !checkMemberPermission(activePermission, requiredPermission)) {
		return false;
	}
	if (shown && !shown(context)) {
		return false;
	}
	return true;
};

const getRenderedMenuItemInContext = (
	item: MenuItem,
	context: ReadablePageContext,
	activeDashboardMode: null | ActiveDashboardMode,
): RenderedDashboardMenuItem => {
	const { title, icon, count, dashboardMode } = item;
	const {
		scopeData: {
			elements: { activeCollection },
		},
		locationData: {
			params: { pubSlug },
		},
	} = context;

	const href = getDashUrl({
		mode: dashboardMode,
		pubSlug,
		collectionSlug: activeCollection?.slug,
	});

	return {
		title,
		href,
		icon: pubPubIcons[icon],
		count: count ? count(context) : null,
		active: activeDashboardMode?.mode === dashboardMode,
	};
};

export const getDashboardMenuState = (context: ReadablePageContext): DashboardMenuState => {
	const {
		locationData,
		scopeData: {
			elements: { activeTargetType },
		},
	} = context;
	const allMenuItems = menuItemsByScopeType[activeTargetType];
	const activeMode = getActiveDashboardMode(locationData);
	const menuItems = allMenuItems
		.filter((item) => shouldShowMenuItemInContext(item, context))
		.map((item) => getRenderedMenuItemInContext(item, context, activeMode));
	return { menuItems, activeMode };
};

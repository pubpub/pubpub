import React from 'react';

import { ActivityItem } from 'types';

import { activityItemRenderers } from './renderers';
import { ActivityItemRenderer, ActivityRenderContext, RenderedActivityItem } from './types';

type Props = {
	item: ActivityItem;
	renderContext: ActivityRenderContext;
};

const ActivityItemText = (props: Props) => {
	const { item, renderContext } = props;
	// This cast to ActivityItemRenderer<any> prevents a TypeScript error:
	// ts(2590): Expression produces a union type that is too complex to represent
	const renderer = activityItemRenderers[item.kind] as ActivityItemRenderer<any>;
	const { message } = renderer(item, renderContext) as RenderedActivityItem;

	return <>{message}</>;
};

export default ActivityItemText;

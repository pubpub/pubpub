import React from 'react';
import { ActivityRenderContext } from 'client/utils/activity/types';
import { ActivityItem, ActivityAssociations } from 'types';
import pick from 'lodash.pick';
import { formatDate } from 'utils/dates';
import { renderActivityItem } from 'client/utils/activity';

type ActivityBundleRowProps = {
	associations: ActivityAssociations;
	userId: string;
	items: ActivityItem[];
};

const ActivityBundleRow = (props: ActivityBundleRowProps) => {
	const scope = pick(props.items[0], ['communityId', 'collectionId', 'pubId']);
	const activityRenderContext: ActivityRenderContext = {
		associations: props.associations,
		userId: props.userId,
		scope,
	};
	return (
		<ol>
			{props.items
				.map((item) => renderActivityItem(item, activityRenderContext))
				.map((renderedItem) => (
					<li key={renderedItem.id}>
						<span>{renderedItem.message}</span>
						<div>
							{renderedItem.excerpt && <span>{renderedItem.excerpt}</span>}
							<span>
								{formatDate(renderedItem.timestamp, { includeTime: false })}
							</span>
						</div>
					</li>
				))}
		</ol>
	);
};

export default ActivityBundleRow;

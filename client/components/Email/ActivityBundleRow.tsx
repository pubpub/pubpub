import React from 'react';
import { ActivityRenderContext } from 'client/utils/activity/types';
import { ActivityItem, ActivityAssociations } from 'types';
import pick from 'lodash.pick';
import styled from 'styled-components';
import { formatDate } from 'utils/dates';
import { renderActivityItem } from 'client/utils/activity';

type ActivityBundleRowProps = {
	associations: ActivityAssociations;
	userId: string;
	items: ActivityItem[];
};

const ExcerptSpan = styled.span`
	background: #f5f5f5;
	font-family: Arial;
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: 14px;
	letter-spacing: 0.01em;
	text-align: left;
`;

const MessageSpan = styled.span`
	font-family: Arial;
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 16px;
	letter-spacing: 0.01em;
	text-align: left;
`;

const DateSpan = styled.span`
	font-family: Arial;
	font-size: 12px;
	font-style: italic;
	font-weight: 400;
	line-height: 14px;
	letter-spacing: 0em;
	text-align: left;
`;

const BundledList = styled.ol`
	padding-left: 20px;
`;

const ActivityBundleRow = (props: ActivityBundleRowProps) => {
	const scope = pick(props.items[0], ['communityId', 'collectionId', 'pubId']);
	const activityRenderContext: ActivityRenderContext = {
		associations: props.associations,
		userId: props.userId,
		scope,
	};
	return (
		<BundledList>
			{props.items
				.map((item) => renderActivityItem(item, activityRenderContext))
				.map((renderedItem) => (
					<li key={renderedItem.id}>
						<div>
							<MessageSpan>{renderedItem.message}</MessageSpan>
							<DateSpan>
								{formatDate(renderedItem.timestamp, { includeTime: false })}
							</DateSpan>
						</div>
						{renderedItem.excerpt && <ExcerptSpan>{renderedItem.excerpt}</ExcerptSpan>}
					</li>
				))}
		</BundledList>
	);
};

export default ActivityBundleRow;

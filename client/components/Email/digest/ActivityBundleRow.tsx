import React from 'react';
import { ActivityRenderContext } from 'client/utils/activity/types';
import { ActivityItem, ActivityAssociations } from 'types';
import pick from 'lodash.pick';
import styled from 'styled-components';
import { formatDate } from 'utils/dates';
import { renderActivityItem } from 'client/utils/activity';
import { TableWrapper } from '../shared';

type ActivityBundleRowProps = {
	associations: ActivityAssociations;
	userId: string;
	items: ActivityItem[];
};

const ExcerptSpan = styled.span`
	display: inline-block;
	width: 460px;
	margin: 10px 0 0;
	overflow: hidden;
	padding: 8px 11px 7px;
	background: #f5f5f5;
	font-size: 12px;
	font-weight: 400;
	line-height: 14px;
	letter-spacing: 0.01em;
	text-align: left;
`;

const MessageSpan = styled.span`
	font-size: 14px;
	font-weight: 400;
	line-height: 16px;
	letter-spacing: 0.01em;
	text-align: left;
`;

const MessageCell = styled.td`
	width: 70%;
	whitespace: nowrap;
`;

const DateCell = styled.td`
	width: 30%;
	text-align: 'right';
	whitespace: nowrap;
`;

const DateSpan = styled.span`
	font-size: 10px;
	font-style: italic;
	font-weight: 400;
	line-height: 11px;
	letter-spacing: 0em;
	text-align: right;
`;

const BundledList = styled.ol`
	padding: 0 40px 0 20px;
`;

const StyledTableWrapper = styled(TableWrapper)`
	width: 100%;
	table-layout: fixed;
	whitespace: nowrap;
`;

const ActivityListItem = styled.li`
	padding: 16px 0;
	border-bottom: 1px solid #dddddd;
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
					<ActivityListItem key={renderedItem.id}>
						<StyledTableWrapper>
							<tr>
								<MessageCell>
									<MessageSpan>{renderedItem.message}</MessageSpan>
								</MessageCell>
								<DateCell>
									<DateSpan>
										{formatDate(renderedItem.timestamp, { includeTime: true })}
									</DateSpan>
								</DateCell>
							</tr>
							{renderedItem.excerpt && (
								<tr>
									<td>
										<ExcerptSpan>{renderedItem.excerpt}</ExcerptSpan>
									</td>
								</tr>
							)}
						</StyledTableWrapper>
					</ActivityListItem>
				))}
		</BundledList>
	);
};

export default ActivityBundleRow;

import React from 'react';
import { RenderedActivityItem } from 'client/utils/activity/types';
import { ActivityItem } from 'types/activity';
import { formatDate } from 'utils/dates';
import dateFormat from 'dateformat';
import { Icon } from 'client/components';
import { Section, Wrapper, Button } from '.';

const now = new Date();

const AffectedObjectRow = (props: AffectedObjectRowProps) => {
	const firstItem = props.renderedItems[0];
	return (
		<div key={props.objectId}>
			<span>
				<Icon icon={firstItem.icon} />
			</span>
			{props.renderedItems.map((item) => (
				<ActivityItemRow item={item} />
			))}
		</div>
	);
};

type AffectedObjectRowProps = {
	objectId: string;
	renderedItems: RenderedActivityItem[];
};

const ActivityItemRow = (props: ActivityItemRowProps) => (
	<>
		<span>{props.item.message}</span>
		<div>
			{props.item.excerpt && <span>{props.item.excerpt}</span>}
			<span>{formatDate(props.item.timestamp, { includeTime: false })}</span>
		</div>
	</>
);

type ActivityItemRowProps = {
	item: RenderedActivityItem;
};

export const Digest = (props: Props) => {
	return (
		<Wrapper>
			<Section alignment="left">
				<Section
					color={props.accentColorLight}
					backgroundColor={props.accentColorDark}
					backgroundImage={props.headerLogo || ''}
					alignment="left"
				>
					<h1>Activity Digest</h1>
					<h3>{dateFormat(now, 'mmmm yyyy')}</h3>
					<div>
						<p>
							This digest is a compilation of activity in the{' '}
							<a href={props.communityUrl}>{props.communityTitle}</a> community during
							the week of{' '}
							{dateFormat(now.setDate(now.getDate() - now.getDay()), 'dd mmmm yyyy')}.
						</p>
						<Button linkUrl="" width="160">
							<span style={{ color: props.accentColorLight }}>
								<Icon icon="pulse" />
							</span>
							<span>View latest activity</span>
						</Button>
					</div>
				</Section>
				<div>
					<span style={{ color: props.accentColorLight }}>
						<Icon icon="office" />
					</span>
					<h2>Community News</h2>
					{Object.entries(props.communityItems).map(([objectId, groupedItems]) => (
						<AffectedObjectRow
							objectId={objectId}
							renderedItems={Object.values(groupedItems).map(
								props.renderActivityItem,
							)}
						/>
					))}
					<span style={{ color: props.accentColorLight }}>
						<Icon icon="document-share" />
					</span>
					<h2>Pub News</h2>
					{Object.entries(props.pubItems).map(([objectId, groupedItems]) => (
						<AffectedObjectRow
							objectId={objectId}
							renderedItems={Object.values(groupedItems).map(
								props.renderActivityItem,
							)}
						/>
					))}
				</div>
			</Section>
		</Wrapper>
	);
};

type DisplayKey = string;

type AffectedObjectId = string;

type DedupedActivityItems = Record<DisplayKey, ActivityItem>;

export type GroupedActivityItems = Record<AffectedObjectId, DedupedActivityItems>;

type Props = {
	communityTitle: string;
	communityUrl: string;
	headerLogo?: string;
	renderActivityItem: any;
	pubItems: GroupedActivityItems;
	communityItems: GroupedActivityItems;
	accentColorDark: string;
	accentColorLight: string;
};

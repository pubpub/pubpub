import React from 'react';
import { ActivityItem } from 'types/activity';
import { ActivityAssociations, Community } from 'types';
import dateFormat from 'dateformat';
import { Icon, IconName } from 'client/components';
import Color from 'color';
import { communityUrl } from 'utils/canonicalUrls';
import { Spacer, Section, Wrapper, Button } from '.';
import ActivityBundleRow from './ActivityBundleRow';
import CommunityHeader from './CommunityHeader';

const now = new Date();

export const Digest = (props: Props) => {
	const fadedBackgroundColor = Color(props.community.accentColorDark || '#2D3752')
		.fade(0.95)
		.rgb()
		.string();

	const accentColorLight = props.community.accentColorLight || 'white';

	return (
		<Wrapper>
			<CommunityHeader community={props.community} title="Activity Digest" />
			<Section backgroundColor={fadedBackgroundColor}>
				<div>
					This digest is a compilation of activity in the{' '}
					<a href={communityUrl(props.community)}>{props.community.title}</a> community
					during the week of{' '}
					{dateFormat(now.setDate(now.getDate() - now.getDay()), 'dd mmmm yyyy')}.
				</div>
				<Button linkUrl="" width="160">
					<span style={{ color: accentColorLight }}>
						<Icon icon="pulse" />
					</span>
					<span>View latest activity</span>
				</Button>
			</Section>
			<Section alignment="left">
				<div>
					<span style={{ color: accentColorLight }}>
						<Icon icon="office" />
					</span>
					<span>Community News</span>
				</div>
				{Object.entries(props.communityItems).map(([objectId, groupedItems]) => (
					<>
						{groupedItems.title}
						<ActivityBundleRow
							associations={props.associations}
							userId={props.userId}
							objectId={objectId}
							items={Object.values(groupedItems.items)}
						/>
					</>
				))}
				<Spacer height={40}>
					<span>&nbsp;</span>
				</Spacer>
				<div>
					<span style={{ color: accentColorLight }}>
						<Icon icon="pubDoc" />
					</span>
					<span>Pub News</span>
				</div>
				{Object.entries(props.pubItems).map(([objectId, groupedItems]) => {
					return (
						<>
							<Spacer height={40}>
								<span>&nbsp;</span>
							</Spacer>
							<span style={{ color: accentColorLight }}>
								<Icon icon={groupedItems.icon} />
							</span>
							{groupedItems.title}
							<ActivityBundleRow
								associations={props.associations}
								userId={props.userId}
								objectId={objectId}
								items={Object.values(groupedItems.items)}
							/>
						</>
					);
				})}
			</Section>
		</Wrapper>
	);
};

type DisplayKey = string;

type AffectedObjectId = string;

type DedupedActivityItems = {
	items: Record<DisplayKey, ActivityItem>;
	title: string;
	icon: IconName;
};

export type GroupedActivityItems = Record<AffectedObjectId, DedupedActivityItems>;

type Props = {
	userId: string;
	community: Community;
	associations: ActivityAssociations;
	pubItems: GroupedActivityItems;
	communityItems: GroupedActivityItems;
};

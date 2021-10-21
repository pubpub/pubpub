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

const MAX_TITLE_CHARS = 65;

const truncate = (str: string) =>
	str.length > MAX_TITLE_CHARS ? str.substr(0, MAX_TITLE_CHARS - 1) + '…' : str;

export const Digest = (props: Props) => {
	const fadedBackgroundColor = Color(props.community.accentColorDark)
		.fade(0.95)
		.rgb()
		.string();

	const backgroundColor =
		props.community.headerColorType === 'light'
			? props.community.accentColorLight || 'white'
			: props.community.accentColorDark || 'black';
	const headerColor =
		props.community.headerColorType === 'light'
			? props.community.accentColorDark || 'black'
			: props.community.accentColorLight || 'white';

	return (
		<Wrapper>
			<CommunityHeader
				community={props.community}
				headerColor={headerColor}
				backgroundColor={props.community.heroBackgroundColor || backgroundColor}
				title="Activity Digest"
			/>
			<Section backgroundColor={fadedBackgroundColor}>
				<table>
					<tr>
						<td>
							This digest is a compilation of activity in the&nbsp;
							<a href={communityUrl(props.community)}>{props.community.title}</a>
							&nbsp;community during the week of&nbsp;
							{dateFormat(now.setDate(now.getDate() - now.getDay()), 'dd mmmm yyyy')}.
						</td>
						<td style={{ verticalAlign: 'middle' }}>
							<Button linkUrl="" width="160">
								<span style={{ color: headerColor }}>
									<Icon icon="pulse" />
								</span>
								<span>View latest activity</span>
							</Button>
						</td>
					</tr>
				</table>
			</Section>
			<Section alignment="left">
				<div>
					<span style={{ color: headerColor }}>
						<Icon icon="office" />
					</span>
					<h2 style={{ display: 'inline-block' }}>Community News</h2>
				</div>
				<ol>
					{Object.entries(props.communityItems).map(([objectId, groupedItems]) => (
						<li key={objectId}>
							<strong>{truncate(groupedItems.title)}</strong>
							<ActivityBundleRow
								associations={props.associations}
								userId={props.userId}
								items={Object.values(groupedItems.items)}
							/>
						</li>
					))}
				</ol>
				<Spacer height={40}>
					<span>&nbsp;</span>
				</Spacer>
				<div>
					<span style={{ color: headerColor }}>
						<Icon icon="pubDoc" />
					</span>
					<h2 style={{ display: 'inline-block' }}>Pub News</h2>
				</div>
				<ol>
					{Object.entries(props.pubItems).map(([objectId, groupedItems]) => {
						return (
							<li key={objectId}>
								<Spacer height={40}>
									<span>&nbsp;</span>
								</Spacer>
								<span style={{ color: headerColor }}>
									<Icon icon={groupedItems.icon} />
								</span>
								<h3 style={{ display: 'inline-block' }}>
									{truncate(groupedItems.title)}
								</h3>
								<ActivityBundleRow
									associations={props.associations}
									userId={props.userId}
									items={Object.values(groupedItems.items)}
								/>
							</li>
						);
					})}
				</ol>
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

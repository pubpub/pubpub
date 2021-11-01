import React from 'react';
import { ActivityItem } from 'types/activity';
import { ActivityAssociations, Community } from 'types';
import { IconName } from 'client/components';
import { Spacer, Section, Wrapper, CommunityHeader } from '..';
import { ActivityBundle, Intro, SectionTitle } from '.';

export const Digest = (props: Props) => {
	const {
		community: { accentColorDark = 'black' },
	} = props;

	return (
		<Wrapper>
			<CommunityHeader community={props.community} title="Activity Digest" />
			<Intro community={props.community} />
			<Section alignment="left">
				<SectionTitle
					icon="office"
					title="Community News"
					accentColorDark={accentColorDark}
				/>
				<ol>
					{Object.entries(props.communityItems).map(([objectId, groupedItems]) => (
						<ActivityBundle
							key={objectId}
							groupedItems={groupedItems}
							isWithTitle={false}
							accentColorDark={accentColorDark}
							associations={props.associations}
							userId={props.userId}
						/>
					))}
				</ol>
				<Spacer height={40}>
					<span>&nbsp;</span>
				</Spacer>
				<SectionTitle icon="pubDoc" title="Pub News" accentColorDark={accentColorDark} />
				<ol>
					{Object.entries(props.pubItems).map(([objectId, groupedItems]) => (
						<ActivityBundle
							key={objectId}
							groupedItems={groupedItems}
							isWithTitle={true}
							accentColorDark={accentColorDark}
							associations={props.associations}
							userId={props.userId}
						/>
					))}
				</ol>
			</Section>
		</Wrapper>
	);
};

type DisplayKey = string;

type AffectedObjectId = string;

export type DedupedActivityItems = {
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

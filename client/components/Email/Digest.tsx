import React from 'react';
import { Section, Wrapper } from '.';

export const Digest = (props: Props) => (
	<Wrapper>
		<Section backgroundColor={props.communityColor} alignment="left">
			<div>
				{props.activityItems.map((item) => (
					<p key={item.text}>{item.text}</p>
				))}
			</div>
		</Section>
	</Wrapper>
);

type ActivityItem = {
	text: string;
};

type Props = {
	activityItems: ActivityItem[];
	communityColor: string;
};

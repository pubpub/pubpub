import React from 'react';
import { render, Section, Wrapper } from '.';

const DigestEmail = ({ activityItems, communityColor }) =>
	render(
		<Wrapper>
			<Section backgroundColor={communityColor} alignment="left">
				<div>
					{activityItems.map((item) => (
						<p>{item.text}</p>
					))}
				</div>
			</Section>
		</Wrapper>,
		'',
	);

export default DigestEmail;

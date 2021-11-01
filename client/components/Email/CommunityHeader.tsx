import React from 'react';
import dateFormat from 'dateformat';
import { Community } from 'types';
import { getResizedUrl } from 'utils/images';
import { Section } from '.';

const now = new Date();

export const CommunityHeader = (props: CommunityHeaderProps) => {
	const logo = getResizedUrl(
		props.community.heroLogo || props.community.headerLogo || '',
		'inside',
		undefined,
		50,
	);
	const backgroundImage = getResizedUrl(
		props.community.heroBackgroundImage || '',
		'cover',
		600,
		undefined,
	);
	return (
		<Section
			color={props.headerColor}
			backgroundColor={props.backgroundColor}
			backgroundImage={backgroundImage || ''}
			logo={logo}
			alignment="left"
		>
			<h1 style={{ fontWeight: 400, fontSize: '20px', lineHeight: '28px' }}>{props.title}</h1>
			<span
				style={{
					fontWeight: 400,
					fontSize: '12px',
					fontStyle: 'italic',
					lineHeight: '17px',
				}}
			>
				{dateFormat(now, 'mmmm yyyy')}
			</span>
		</Section>
	);
};

type CommunityHeaderProps = {
	title: string;
	headerColor: string;
	backgroundColor: string;
	community: Community;
};

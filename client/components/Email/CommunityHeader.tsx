import React from 'react';
import dateFormat from 'dateformat';
import styled from 'styled-components';

import { Community } from 'types';
import { getResizedUrl } from 'utils/images';

import { Section } from '.';

const H1Style = styled.h1`
	font-weight: 400;
	font-size: 20px;
	line-height: 28px;
`;

const SpanStyle = styled.span`
	font-weight: 400;
	font-size: 12px;
	font-style: italic;
	line-height: 17px;
`;

export const CommunityHeader = (props: CommunityHeaderProps) => {
	const now = new Date();
	const {
		community: {
			heroLogo = '',
			headerLogo = '',
			heroBackgroundImage = '',
			accentColorDark = 'black',
			accentColorLight = 'white',
		},
	} = props;
	const logo = getResizedUrl(heroLogo || headerLogo, 'inside', undefined, 50);
	const backgroundImage = getResizedUrl(heroBackgroundImage, 'cover', 600, undefined);

	const backgroundColor = props.community.heroBackgroundColor
		? props.community.heroBackgroundColor
		: props.community.headerColorType === 'light'
		? accentColorLight
		: accentColorDark;
	const headerColor =
		props.community.headerColorType === 'light' ? accentColorDark : accentColorLight;

	return (
		<Section
			color={headerColor}
			backgroundColor={backgroundColor}
			backgroundImage={backgroundImage}
			logo={logo}
			alignment="left"
		>
			<H1Style>{props.title}</H1Style>
			<SpanStyle>{dateFormat(now, 'mmmm yyyy')}</SpanStyle>
		</Section>
	);
};

type CommunityHeaderProps = {
	title: string;
	community: Community;
};

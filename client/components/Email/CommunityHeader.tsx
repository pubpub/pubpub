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

	const {
		community: { accentColorLight = 'white', accentColorDark = 'black' },
	} = props;

	const backgroundColor =
		props.community.headerColorType === 'light'
			? accentColorLight || 'white'
			: accentColorDark || 'black';
	const headerColor =
		props.community.headerColorType === 'light'
			? accentColorDark || 'black'
			: accentColorLight || 'white';

	return (
		<Section
			color={headerColor}
			backgroundColor={props.community.heroBackgroundColor || backgroundColor}
			backgroundImage={backgroundImage || ''}
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

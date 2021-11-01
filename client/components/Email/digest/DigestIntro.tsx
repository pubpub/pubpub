import React from 'react';
import styled from 'styled-components';
import dateFormat from 'dateformat';
import { Community } from 'types';
import { communityUrl } from 'utils/canonicalUrls';
import { Icon } from 'client/components';
import Color from 'color';
import { Section, Button } from '..';
import { TableWrapper } from '../shared';

const TableWrapperStyle = styled(TableWrapper)<StyleProps>`
	border-top: 1px solid ${(props) => props.accentColorDark};
`;

type StyleProps = {
	accentColorDark: string;
};

const now = new Date();

const ButtonCellStyle = styled.td`
	vertical-align: middle;
	width: 39%;
`;

const TextCellStyle = styled.td`
	padding-right: 30px;
	font-size: 12px;
	line-height: 18px;
	font-weight: 400;
	text-align: justify;
	width: 61%;
`;

const SpanStyle = styled.span`
	fill: #333333;
	padding-right: 9px;
`;

export const DigestIntro = (props: PropTypes) => {
	const fadedBackgroundColor = Color(props.accentColorDark)
		.fade(0.95)
		.rgb()
		.string();

	return (
		<TableWrapperStyle accentColorDark={props.accentColorDark}>
			<tr>
				<td>
					<Section backgroundColor={fadedBackgroundColor}>
						<TableWrapper>
							<tr>
								<TextCellStyle>
									This digest is a compilation of activity in the&nbsp;
									<a href={communityUrl(props.community)}>
										{props.community.title}
									</a>
									&nbsp;community during the week of&nbsp;
									{dateFormat(
										now.setDate(now.getDate() - now.getDay()),
										'dd mmmm yyyy',
									)}
									.
								</TextCellStyle>
								<ButtonCellStyle>
									<Button
										linkUrl={`${communityUrl(props.community)}/dash/activity`}
										width="100%"
									>
										<SpanStyle>
											<Icon icon="pulse" />
										</SpanStyle>
										<span>View latest activity</span>
									</Button>
								</ButtonCellStyle>
							</tr>
						</TableWrapper>
					</Section>
				</td>
			</tr>
		</TableWrapperStyle>
	);
};

type PropTypes = {
	accentColorDark: string;
	community: Community;
};

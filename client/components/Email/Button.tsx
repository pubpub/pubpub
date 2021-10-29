import styled from 'styled-components';
import React from 'react';

import { TableWrapper } from './shared';

const StyledTableWrapper = styled(TableWrapper).attrs({
	align: 'center',
})<StyleProps>`
	background-color: ${(props) => props.backgroundColor};
	text-align: center;
	width: ${(props) => props.width}px !important;
`;

const StyledRowWrapper = styled.tr``;

const StyledCellWrapper = styled.td.attrs({
	align: 'center',
	valign: 'middle',
})`
	height: 40px;
	text-align: center;
`;

const StyledButton = styled.a<StyleProps>`
	border: 1px solid ${(props) => props.color};
	border-radius: 5px;
	color: ${(props) => props.color || 'inherit'};
	display: inline-block;
	font-family: Arial;
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 16px;
	letter-spacing: 0.01em;
	text-align: center;
	mso-hide: all;
	padding: 12px 18px;
	text-decoration: none;
	-webkit-text-size-adjust: none;
	width: ${(props) => props.width}px !important;
`;

type StyleProps = {
	color?: string;
	width?: string;
	backgroundColor?: string;
};

type Props = StyleProps & {
	children: React.ReactNode;
	linkUrl?: string;
};

export const Button = ({
	children,
	linkUrl = '#',
	width = '200',
	color,
	backgroundColor = 'transparent',
}: Props) => (
	<StyledTableWrapper width={width} backgroundColor={backgroundColor}>
		<StyledRowWrapper>
			<StyledCellWrapper>
				<div>
					<StyledButton href={linkUrl} color={color} width={width}>
						<span>{children}</span>
					</StyledButton>
				</div>
			</StyledCellWrapper>
		</StyledRowWrapper>
	</StyledTableWrapper>
);

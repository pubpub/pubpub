import React from 'react';
import styled from 'styled-components';

import { TableWrapper } from './shared';

const StyledTableWrapper = styled(TableWrapper).attrs({
	align: 'center',
	role: 'presentation',
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
	color: ${(props) => props.color};
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
	color = 'white',
	backgroundColor = 'transparent',
}: Props) => (
	<TableWrapper width="100%">
		<tbody>
			<tr>
				<td align="center">
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
				</td>
			</tr>
		</tbody>
	</TableWrapper>
);

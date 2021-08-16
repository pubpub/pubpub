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
	border: none;
	border-radius: 2px;
	color: ${(props) => props.color};
	display: inline-block;
	font-size: 16px;
	line-height: 34px;
	mso-hide: all;
	padding: 2px 10px 0 10px;
	text-align: center;
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
	backgroundColor = '#2d2e2f99',
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

import React from 'react';
import styled from 'styled-components';

import { BaseTableStyle } from './shared';

const TableStyle = styled(BaseTableStyle)<StyleProps>`
	background: ${(props) =>
		`${props.logo ? ` url("${props.logo}") no-repeat right 40px center, ` : ''}${
			props.backgroundImage ? ` url("${props.backgroundImage}") no-repeat right` : ''
		}`};
	background-color: ${(props) => props.backgroundColor};
	font-size: ${(props) => props.fontSize}px;
	text-align: ${(props) => props.alignment};
	max-width: ${(props) => props.width}px;
	width: 100%;
`;

export const Section = ({
	children,
	alignment = 'center',
	fontSize = 18,
	fontFamily = 'roboto,helvetica neue,helvetica,arial,sans-serif',
	backgroundColor = '#FFFFFF',
	logo,
	backgroundImage,
	color = '#333333',
	innerPadding = '40px',
	width = 600,
}: Props) => (
	<TableStyle
		fontSize={fontSize}
		fontFamily={fontFamily}
		backgroundColor={backgroundColor}
		backgroundImage={backgroundImage}
		logo={logo}
		alignment={alignment}
		width={width}
	>
		<tr>
			<td valign="top" style={{ padding: innerPadding, color }}>
				{children}
			</td>
		</tr>
	</TableStyle>
);

type StyleProps = {
	fontFamily?: string;
	alignment?: string;
	fontSize?: number;
	width?: number;
	backgroundColor?: string;
	backgroundImage?: string;
	logo?: string;
};

type Props = StyleProps & {
	children: React.ReactNode;
	color?: string;
	innerPadding?: string;
};

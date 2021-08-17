import React from 'react';
import styled from 'styled-components';

import { TableWrapper } from './shared';

const StyledTableWrapper = styled(TableWrapper)<StyleProps>`
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
	backgroundColor = '#2c3654',
	color = '#fef6cf',
	innerPadding = '40px',
	width = 600,
}: Props) => (
	<StyledTableWrapper
		fontSize={fontSize}
		fontFamily={fontFamily}
		backgroundColor={backgroundColor}
		alignment={alignment}
		width={width}
	>
		<tr>
			<td valign="top" style={{ padding: innerPadding, color }}>
				{children}
			</td>
		</tr>
	</StyledTableWrapper>
);

type StyleProps = {
	fontFamily?: string;
	alignment?: string;
	fontSize?: number;
	width?: number;
	backgroundColor?: string;
};

type Props = StyleProps & {
	children: React.ReactNode;
	color?: string;
	innerPadding?: string;
};

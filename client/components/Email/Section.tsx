import React from 'react';
import styled from 'styled-components';

import { TableWrapper } from './shared';

const StyledTableWrapper = styled(TableWrapper).attrs((props) => ({
	fontFamily: props.fontFamily,
	fontSize: props.fontSize,
	width: props.width,
	style: { backgroundColor: props.backgroundColor },
}))`
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
		fonSize={fontSize}
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

type Props = {
	children: React.ReactNode;
	alignment?: string;
	fontFamily?: string;
	fontSize?: number;
	backgroundColor?: string;
	color?: string;
	innerPadding?: string;
	width?: number;
};

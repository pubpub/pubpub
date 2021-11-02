import React from 'react';
import styled from 'styled-components';

import { BaseTableStyle } from './shared';

const TableStyle = styled(BaseTableStyle).attrs({
	height: '100%',
	width: '100%',
})``;

export const Wrapper = ({ children, backgroundColor = 'white' }: Props) => (
	<body
		style={{
			fontFamily: 'Helvetica, Arial, sans-serif',
			backgroundColor,
			maxWidth: '600px',
		}}
	>
		<div style={{ textAlign: 'center' }}>
			<TableStyle>
				<tbody>
					<tr>
						<td align="center" valign="top">
							{children}
						</td>
					</tr>
				</tbody>
			</TableStyle>
		</div>
	</body>
);

type Props = {
	children: React.ReactNode;
	backgroundColor?: string;
};

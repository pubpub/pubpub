import React from 'react';
import styled from 'styled-components';

import { TableWrapper } from './shared';

const StyledTableWrapper = styled(TableWrapper).attrs({
	height: '100%',
	width: '100%',
})``;

export const Wrapper = ({ children, backgroundColor = '#C0FFEE' }: Props) => (
	<body
		style={{
			fontFamily: 'Helvetica, Arial, sans-serif',
			backgroundColor,
			maxWidth: '600px',
		}}
	>
		<div style={{ textAlign: 'center' }}>
			<StyledTableWrapper>
				<tbody>
					<tr>
						<td align="center" valign="top">
							{children}
						</td>
					</tr>
				</tbody>
			</StyledTableWrapper>
		</div>
	</body>
);

type Props = {
	children: React.ReactNode;
	backgroundColor?: string;
};

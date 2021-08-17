import React from 'react';
import styled from 'styled-components';

import { TableWrapper } from './shared';

const StyledTableWrapper = styled(TableWrapper).attrs({
	height: '100%',
	width: '100%',
})``;

export const Wrapper = ({ children, backgroundColor = 'white' }: Props) => (
	<body
		style={{
			fontFamily: 'Helvetica, Arial, sans-serif',
			padding: '20px 0',
			backgroundColor,
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

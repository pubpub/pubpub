import React from 'react';
import styled from 'styled-components';

import { TableWrapper } from './shared';

const StyledResponsiveColumns = styled.td`
	width: ${(props) => props.width};
`;

export const Grid = ({ children, width = 520 }: Props) => {
	const numberOfColumns = React.Children.count(children);
	const columnWidth = Math.floor(width / numberOfColumns);

	return (
		<TableWrapper>
			<tbody>
				<tr>
					{React.Children.map(children, (child) => {
						return (
							<StyledResponsiveColumns width={`${columnWidth}px`}>
								{child}
							</StyledResponsiveColumns>
						);
					})}
				</tr>
			</tbody>
		</TableWrapper>
	);
};

type Props = {
	children: React.ReactNode;
	width?: number;
};

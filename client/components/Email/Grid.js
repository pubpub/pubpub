import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TableWrapper } from './shared';

const StyledResponsiveColumns = styled.td`
	width: ${(props) => props.width};
`;

export const Grid = ({ children, width }) => {
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

Grid.propTypes = {
	width: PropTypes.number,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};

Grid.defaultProps = {
	width: 520,
};

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TableWrapper } from './shared';

const StyledTableWrapper = styled(TableWrapper).attrs({
	height: '100%',
	width: '100%',
})``;

export const Wrapper = ({ children, backgroundColor }) => (
	<body
		style={{
			fontFamily: 'Helvetica, Arial, sans-serif',
			padding: '20px 0',
			backgroundColor,
		}}
	>
		<center>
			<StyledTableWrapper>
				<tbody>
					<tr>
						<td align="center" valign="top">
							{children}
						</td>
					</tr>
				</tbody>
			</StyledTableWrapper>
		</center>
	</body>
);

Wrapper.propTypes = {
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
	backgroundColor: PropTypes.string,
};

Wrapper.defaultProps = {
	backgroundColor: 'white',
};

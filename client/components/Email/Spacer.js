import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { TableWrapper } from './shared';

const StyledWrapperCell = styled.td.attrs((props) => ({
	valign: 'top',
	height: props.height,
}))`
	font-size: ${(props) => props.height}px;
	line-height: ${(props) => props.height}px;
`;

export const Spacer = ({ children, height }) => (
	<TableWrapper width="100%">
		<tr>
			<StyledWrapperCell height={height}>{children}</StyledWrapperCell>
		</tr>
	</TableWrapper>
);

Spacer.propTypes = {
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
	height: PropTypes.number,
};

Spacer.defaultProps = {
	height: 50,
};

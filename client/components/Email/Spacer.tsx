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

export const Spacer = ({ children, height = 50 }: Props) => (
	<TableWrapper width="100%">
		<tr>
			<StyledWrapperCell height={height}>{children}</StyledWrapperCell>
		</tr>
	</TableWrapper>
);

type Props = {
	children: React.ReactNode;
	height?: number;
};

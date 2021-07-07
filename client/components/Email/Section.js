import React from 'react';
import PropTypes from 'prop-types';
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
	innerPadding,
	backgroundColor,
	color,
	children,
	alignment,
	width,
	fontFamily,
	fontSize,
}) => (
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

Section.propTypes = {
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
	alignment: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	backgroundColor: PropTypes.string,
	color: PropTypes.string,
	innerPadding: PropTypes.string,
	width: PropTypes.number,
};

Section.defaultProps = {
	alignment: 'center',
	fontSize: 18,
	fontFamily: 'roboto,helvetica neue,helvetica,arial,sans-serif',
	backgroundColor: '#2c3654',
	color: '#fef6cf',
	innerPadding: '40px',
	width: 600,
};

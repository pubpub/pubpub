import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TableWrapper } from './shared';

const StyledTableWrapper = styled(TableWrapper).attrs({
	align: 'center',
	role: 'presentation',
})`
	background-color: ${(props) => props.backgroundColor};
	text-align: center;
	width: ${(props) => props.width}px !important;
`;

const StyledRowWrapper = styled.tr``;

const StyledCellWrapper = styled.td.attrs({
	align: 'center',
	valign: 'middle',
})`
	height: 40px;
	text-align: center;
`;

const StyledButton = styled.a`
	border: none;
	border-radius: 2px;
	color: ${(props) => props.color};
	display: inline-block;
	font-size: 16px;
	line-height: 34px;
	mso-hide: all;
	padding: 2px 10px 0 10px;
	text-align: center;
	text-decoration: none;
	-webkit-text-size-adjust: none;
	width: ${(props) => props.width}px !important;
`;

export const Button = ({ children, linkUrl, width, backgroundColor, color }) => (
	<TableWrapper width="100%">
		<tbody>
			<tr>
				<td align="center">
					<StyledTableWrapper width={width} backgroundColor={backgroundColor}>
						<StyledRowWrapper>
							<StyledCellWrapper>
								<div>
									<StyledButton href={linkUrl} color={color} width={width}>
										<span>{children}</span>
									</StyledButton>
								</div>
							</StyledCellWrapper>
						</StyledRowWrapper>
					</StyledTableWrapper>
				</td>
			</tr>
		</tbody>
	</TableWrapper>
);

Button.propTypes = {
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
	width: PropTypes.string,
	linkUrl: PropTypes.string,
	color: PropTypes.string,
	backgroundColor: PropTypes.string,
};

Button.defaultProps = {
	width: '200',
	linkUrl: '#',
	color: 'white',
	backgroundColor: '#2d2e2f99',
};

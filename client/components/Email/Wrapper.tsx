import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { BaseTableStyle } from './shared';

type Props = {
	preview?: string;
	children: React.ReactNode;
	backgroundColor?: string;
};

const TableStyle = styled(BaseTableStyle).attrs({
	height: '100%',
	width: '100%',
})``;

const GlobalStyle = createGlobalStyle`
  .hidden-fix {
    display: none !important;
	}
`;

const EmailPreview = (props: { text: string }) => {
	let text = props.text;
	for (let i = 150 - text.length; i >= 0; i--) {
		text += `&nbsp; &zwnj; `;
	}
	return (
		<div
			className="hidden-fix"
			style={{
				display: 'none',
				fontSize: '1px',
				lineHeight: '1px',
				maxHeight: '0px',
				maxWidth: '0px',
				opacity: 0,
				overflow: 'hidden',
			}}
			dangerouslySetInnerHTML={{ __html: text }}
		></div>
	);
};

export const Wrapper = ({ preview, children, backgroundColor = 'white' }: Props) => (
	<body
		style={{
			fontFamily: 'Helvetica, Arial, sans-serif',
			backgroundColor,
			maxWidth: '600px',
		}}
	>
		<GlobalStyle />
		{preview && <EmailPreview text={preview} />}
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

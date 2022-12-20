import React from 'react';
import { storiesOf } from '@storybook/react';
import { MinimalEditor } from 'components';
import { plainDoc } from 'utils/storybook/data';

const wrapperStyle = { margin: '1em', padding: '20px', border: '1px solid #CCC' };

storiesOf('components/MinimalEditor', module).add('default', () => (
	<div>
		<div style={wrapperStyle}>
			<MinimalEditor focusOnLoad={true} />
		</div>
		<div style={wrapperStyle}>
			<MinimalEditor
				useFormattingBar={true}
				placeholder="Type here"
				initialContent={plainDoc}
			/>
		</div>
	</div>
));

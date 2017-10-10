import React from 'react';
import { storiesOf } from '@storybook/react';
import FormattingHelp from 'components/FormattingHelp/FormattingHelp';

const wrapperStyle = { margin: '1em' };

storiesOf('FormattingHelp', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<FormattingHelp />
		</div>
	</div>
));

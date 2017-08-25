import React from 'react';
import { storiesOf } from '@storybook/react';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import UserNav from 'components/UserNav/UserNav';
import { accentDataDark, userData } from './_data';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.2)' };

storiesOf('UserNav', module)
.add('Default', () => (
	<div>
		<AccentStyle {...accentDataDark} />
		<div style={wrapperStyle}>
			<UserNav 
				userSlug={'maggie'}
			/>
		</div>
	</div>
));

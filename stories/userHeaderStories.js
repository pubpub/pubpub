import React from 'react';
import { storiesOf } from '@storybook/react';
import UserHeader from 'components/UserHeader/UserHeader';
import { userData } from './_data';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.2)' };

storiesOf('UserHeader', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<UserHeader 
				userData={userData}
			/>
		</div>
		<div style={wrapperStyle}>
			<UserHeader 
				userData={userData}
				isUser={true}
			/>
		</div>
	</div>
));

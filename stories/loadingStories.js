import React from 'react';
import { storiesOf } from '@storybook/react';
import Loading from 'components/Loading/Loading';

storiesOf('Loading', module)
.add('Default', () => (
	<div>
		<Loading height={70} />
		<Loading width={200} />
		<Loading borderRadius={200} height={150} width={150} />
	</div>
));

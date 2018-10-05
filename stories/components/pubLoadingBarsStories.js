import React from 'react';
import { storiesOf } from '@storybook/react';
import PubLoadingBars from 'components/PubLoadingBars/PubLoadingBars';

storiesOf('Components', module)
.add('PubLoadingBars', () => (
	<div style={{ padding: '20px', width: '100%' }}>
		<PubLoadingBars />
	</div>
));

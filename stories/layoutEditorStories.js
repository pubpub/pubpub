import React from 'react';
import { storiesOf } from '@storybook/react';
import LayoutEditor from 'components/LayoutEditor/LayoutEditor';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { accentDataDark } from './_data';

storiesOf('LayoutEditor', module)
.add('Default', () => (
	<div>
		<AccentStyle {...accentDataDark} />
		<LayoutEditor
			onSave={(data)=>{ console.log(data); }}
			initialLayout={[
				{ id: 'as8dj4', type: 'pubs', content: { title: '', size: 'medium', limit: 0, pubIds: [] } },
			]}
		/>
	</div>
));

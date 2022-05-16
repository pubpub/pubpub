/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import TitleEditor from './TitleEditor';

storiesOf('components/TitleEditor', module).add('default', () => {
	let [rendered, setRendered] = useState('');
	return (
		<>
			<TitleEditor
				initialValue="<em>Initial <strong>value</strong></em>"
				onChange={setRendered}
			/>
			<strong>Rendered:</strong>
			<div dangerouslySetInnerHTML={{ __html: rendered }}></div>
		</>
	);
});

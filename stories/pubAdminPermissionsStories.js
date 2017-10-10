import React from 'react';
import { storiesOf } from '@storybook/react';
import PubAdminPermissions from 'components/PubAdminPermissions/PubAdminPermissions';

const handleSelection = (val)=> {
	console.log(val);
};
const wrapperStyle = { margin: '1em 1em 5em' };

storiesOf('PubAdminPermissions', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<PubAdminPermissions
				appData={{
					title: 'Viral Communications',
					permissions: 'view',
				}}
				pubId={'234-123512-fasdf-232'}
				onSave={handleSelection}
			/>
		</div>
	</div>
));

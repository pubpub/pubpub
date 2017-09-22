import React from 'react';
import { storiesOf } from '@storybook/react';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';

const handleSelection = (val)=> {
	console.log(val);
};
const wrapperStyle = { margin: '1em' };

storiesOf('UserAutocomplete', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<UserAutocomplete
				onSelect={handleSelection}
			/>
		</div>
		<div style={wrapperStyle}>
			<UserAutocomplete
				placeholder={'My placeholder...'}
				onSelect={handleSelection}
				allowCustomUser={true}
			/>
		</div>
	</div>
));

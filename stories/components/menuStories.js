import React from 'react';
import { storiesOf } from '@storybook/react';
import { Menu, MenuItem } from 'components/Menu/Menu';
import { Button } from '@blueprintjs/core';

storiesOf('components/Menu', module).add('default', () => {
	return (
		<Menu disclosure={(props) => <Button {...props}>Hello!</Button>}>
			<MenuItem text="hello" />
			<MenuItem text="hi" />
			<MenuItem text="hey">
				<MenuItem text="hola" />
				<MenuItem text="ni hao" />
			</MenuItem>
		</Menu>
	);
});

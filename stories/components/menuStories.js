import React from 'react';
import { storiesOf } from '@storybook/react';
import { Menu, MenuItem, MenuItemDivider } from 'components/Menu/Menu';
import { Button } from '@blueprintjs/core';

const items = (
	<React.Fragment>
		<MenuItem icon="doughnut-chart" text="hello" />
		<MenuItem icon="git-branch" text="hi" />
		<MenuItemDivider />
		<MenuItem icon="paperclip" text="what's up">
			<MenuItem text="hola — a longer item" />
			<MenuItem text="你好">
				<MenuItem text="还要菜单吗" onClick={() => alert('You found it!')} />
			</MenuItem>
		</MenuItem>
	</React.Fragment>
);

storiesOf('components/Menu', module)
	.add('button', () => {
		return (
			<Menu
				disclosure={(props) => {
					const { ref, ...restProps } = props;
					return (
						<Button rightIcon="caret-down" {...restProps} elementRef={props.ref}>
							Hello there
						</Button>
					);
				}}
			>
				{items}
			</Menu>
		);
	})
	.add('div', () => {
		return <Menu disclosure={(props) => <div {...props}>Hello!</div>}>{items}</Menu>;
	});

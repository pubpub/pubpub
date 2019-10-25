import React from 'react';
import { storiesOf } from '@storybook/react';
import { Menu, MenuItem, MenuItemDivider } from 'components/Menu';
import { Button } from '@blueprintjs/core';

const items = (
	<React.Fragment>
		<MenuItem icon="doughnut-chart" text="hello" />
		<MenuItem icon="git-branch" text="hi" />
		<MenuItemDivider />
		<MenuItem icon="paperclip" text="what's up">
			<MenuItem text="hola — a longer item" />
			<MenuItem text="what's in here">
				<MenuItem
					text="i wonder if you can click me"
					onClick={() => alert('You found it!')}
				/>
			</MenuItem>
		</MenuItem>
	</React.Fragment>
);

storiesOf('components/Menu', module)
	.add('button', () => {
		return (
			<Menu
				shift={100}
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

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Menu, MenuItem, MenuItemDivider } from 'components/Menu';

type commandPropType = {
	key: string;
	title: string;
	icon?: string;
};

// @ts-expect-error ts-migrate(2322) FIXME: Type 'Requireable<InferProps<{ key: Validator<stri... Remove this comment to see the full error message
const commandPropType: PropTypes.Requireable<commandPropType> = PropTypes.shape({
	key: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	icon: PropTypes.string,
});

type Props = {
	disclosure: ((...args: any[]) => any) | React.ReactNode;
	className?: string;
	editorChangeObject: {
		menuItems?: {}[];
		view?: {
			focus?: (...args: any[]) => any;
		};
	};
	commands: (commandPropType | commandPropType[])[];
	markActiveItems?: boolean;
};

const defaultProps = {
	className: '',
	markActiveItems: true,
};

const CommandMenu = React.forwardRef<any, Props>((props, ref) => {
	const {
		editorChangeObject: { menuItems = [], view: editorView },
		className,
		commands,
		disclosure,
		markActiveItems,
		...restProps
	} = props;

	const renderMenuItemForCommand = (command) => {
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'title' does not exist on type '{}'.
		const menuItem = menuItems.find((item) => item.title === command.key);
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'canRun' does not exist on type '{}'.
		if (!menuItem || !menuItem.canRun) {
			return null;
		}
		return (
			<MenuItem
				key={command.key}
				// @ts-expect-error ts-migrate(2339) FIXME: Property 'isActive' does not exist on type '{}'.
				active={markActiveItems && menuItem.isActive}
				text={command.title}
				icon={command.icon}
				onClick={() => {
					// @ts-expect-error ts-migrate(2339) FIXME: Property 'run' does not exist on type '{}'.
					menuItem.run();
					// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
					editorView.focus();
				}}
			/>
		);
	};

	const getSectionsFromCommands = () => {
		if (Array.isArray(commands[0])) {
			return commands;
		}
		return [commands];
	};

	return (
		<Menu
			ref={ref}
			{...restProps}
			disclosure={disclosure}
			menuStyle={{ zIndex: 20 }}
			className={classNames('command-menu-component', className)}
		>
			{/* @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable. */}
			{getSectionsFromCommands().map((section, index) => {
				return (
					// eslint-disable-next-line react/no-array-index-key
					<React.Fragment key={index}>
						{index > 0 && <MenuItemDivider />}
						{section.map(renderMenuItemForCommand)}
					</React.Fragment>
				);
			})}
		</Menu>
	);
});
CommandMenu.defaultProps = defaultProps;
export default CommandMenu;

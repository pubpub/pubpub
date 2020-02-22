import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import { generateHash } from 'utils';
import { Button } from '@blueprintjs/core';
// import Icon from 'components/Icon/Icon';
import PageAutocomplete from './NavDrag/PageAutocomplete';
import NavBuilderList from './NavBuilderList';

require('./navBuilder.scss');

const propTypes = {
	initialNav: PropTypes.array.isRequired,
	prefix: PropTypes.array,
	suffix: PropTypes.array,
	pages: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
};

const defaultProps = {
	prefix: [],
	suffix: [],
};

const NavBuilder = (props) => {
	const { initialNav, pages, onChange, prefix, suffix } = props;
	const [currentNav, setCurrentNav] = useState(initialNav);
	const userSetElements = currentNav.slice(prefix.length, currentNav.length - suffix.length);

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};
	const onDragEnd = (result) => {
		if (result.destination) {
			const nextUserElements =
				result.destination.droppableId === 'main-list'
					? reorder(userSetElements, result.source.index, result.destination.index)
					: userSetElements.map((item) => {
							if (item.id === result.destination.droppableId) {
								return {
									...item,
									children: reorder(
										item.children,
										result.source.index,
										result.destination.index,
									),
								};
							}
							return item;
					  });
			const newNav = [...prefix, ...nextUserElements, ...suffix];
			setCurrentNav(newNav);
			onChange(newNav);
		}
	};
	const addItem = (newItem) => {
		const newNav = [...prefix, newItem, ...userSetElements, ...suffix];
		setCurrentNav(newNav);
		onChange(newNav);
	};
	const updateItem = (dropdownId, index, newItemValues) => {
		// console.log(index, newItemValues);
		// const nextUserElements = [...userSetElements];
		// nextUserElements[index] = { ...nextUserElements[index], ...newItemValues };
		// const newNav = [...prefix, ...nextUserElements, ...suffix];
		// setCurrentNav(newNav);
		// onChange(newNav);
		const nextUserElements =
			dropdownId === 'main-list'
				? userSetElements.map((item, currIndex) => {
						return currIndex === index ? { ...item, ...newItemValues } : item;
				  })
				: userSetElements.map((item) => {
						if (item.id === dropdownId) {
							return {
								...item,
								children: item.children.map((subItem, subCurrIndex) => {
									return subCurrIndex === index
										? { ...subItem, ...newItemValues }
										: subItem;
								}),
							};
						}
						return item;
				  });
		const newNav = [...prefix, ...nextUserElements, ...suffix];
		setCurrentNav(newNav);
		onChange(newNav);
	};
	const removeItem = (itemId, dropdownId) => {
		const nextUserElements =
			dropdownId === 'main-list'
				? userSetElements.filter((item) => {
						return item.id !== itemId && item !== itemId;
				  })
				: userSetElements.map((item) => {
						if (item.id === dropdownId) {
							return {
								...item,
								children: item.children.filter((subItem) => {
									return subItem.id !== itemId  && subItem !== itemId;
								}),
							};
						}
						return item;
				  });
		const newNav = [...prefix, ...nextUserElements, ...suffix];
		setCurrentNav(newNav);
		onChange(newNav);
	};

	const newLink = { id: generateHash(8), title: 'Link', href: '' };
	const newDropdown = { id: generateHash(8), title: 'Dropdown Menu', children: [] };
	return (
		<div className="nav-builder-component">
			<div className="new-items">
				<PageAutocomplete
					pages={pages}
					placeholder="Add Page"
					onSelect={(newItem) => {
						addItem(newItem.id);
					}}
				/>
				<Button
					text="Add Link"
					onClick={() => {
						addItem(newLink);
					}}
				/>
				<Button
					text="Add Dropdown Menu"
					onClick={() => {
						addItem(newDropdown);
					}}
				/>
			</div>
			<DragDropContext onDragEnd={onDragEnd}>
				<div className="items">
					Hello
					<NavBuilderList
						id="main-list"
						items={userSetElements}
						removeItem={removeItem}
						updateItem={updateItem}
						pages={pages}
						newLink={newLink}
					/>
				</div>
			</DragDropContext>
		</div>
	);
};

NavBuilder.propTypes = propTypes;
NavBuilder.defaultProps = defaultProps;
export default NavBuilder;

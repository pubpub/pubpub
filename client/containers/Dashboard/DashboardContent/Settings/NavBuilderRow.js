import React from 'react';
import PropTypes from 'prop-types';
import { Button, InputGroup } from '@blueprintjs/core';
import PageAutocomplete from './NavDrag/PageAutocomplete';
// import NavBuilderList from './NavBuilderList';

const propTypes = {
	NavBuilderList: PropTypes.func,
	dropdownId: PropTypes.string.isRequired,
	index: PropTypes.number.isRequired,
	item: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	updateItem: PropTypes.func.isRequired,
	removeItem: PropTypes.func.isRequired,
	pages: PropTypes.array.isRequired,
	newLink: PropTypes.object.isRequired,
};

const defaultProps = {
	NavBuilderList: undefined,
};

const NavBuilderRow = (props) => {
	const {
		dropdownId,
		NavBuilderList,
		index,
		item,
		pages,
		updateItem,
		removeItem,
		newLink,
	} = props;
	const data = typeof item === 'string' ? pages.find((page) => page.id === item) : item;
	let type = 'page';
	if (typeof data.href === 'string') {
		type = 'link';
	}
	if (data.children) {
		type = 'dropdown';
	}

	return (
		<div className="nav-builder-row-component">
			<div className="top">
				{type === 'page' && <div className="title">{data.title}</div>}
				{type !== 'page' && (
					<InputGroup
						placeholder="Title"
						onChange={(evt) => {
							updateItem(dropdownId, index, { title: evt.target.value });
						}}
						value={data.title}
					/>
				)}
				{type === 'link' && (
					<InputGroup
						placeholder="https://www.example.com"
						onChange={(evt) => {
							updateItem(dropdownId, index, { href: evt.target.value });
						}}
						value={data.href}
					/>
				)}
				{type === 'dropdown' && (
					<React.Fragment>
						<PageAutocomplete
							pages={pages}
							placeholder="Add Page"
							onSelect={(newItem) => {
								updateItem(dropdownId, index, {
									children: [newItem, ...item.children],
								});
							}}
						/>
						<Button
							text="Add Link"
							onClick={() => {
								updateItem(dropdownId, index, {
									children: [newLink, ...item.children],
								});
							}}
						/>
					</React.Fragment>
				)}
			</div>
			{type === 'dropdown' && (
				<div className="children">
					<NavBuilderList
						id={item.id}
						items={item.children}
						removeItem={removeItem}
						updateItem={updateItem}
						pages={pages}
						newLink={newLink}
					/>
				</div>
			)}
		</div>
	);
};

NavBuilderRow.propTypes = propTypes;
NavBuilderRow.defaultProps = defaultProps;
export default NavBuilderRow;

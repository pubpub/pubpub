import React, { useCallback } from 'react';
import { Button, ButtonGroup, Checkbox, Menu, Popover, Radio } from '@blueprintjs/core';

import { toTitleCase, joinCommaReducer } from '../../utils/string';
import { Filter, Mode, pluralFilterLookup } from './constants';

require('./pubEdgeListingControls.scss');

export const PubEdgeListingControls = (props) => {
	const createModeHandler = (mode) => (e) => {
		e.preventDefault();
		props.onModeChange(mode);
	};
	const setCarousel = useCallback(createModeHandler(Mode.Carousel), [props.onModeChange]);
	const setList = useCallback(createModeHandler(Mode.List), [props.onModeChange]);
	const filterMenuItems = Object.values(Filter).map((filter) => {
		const checked = props.filters.indexOf(filter) > -1;
		const toggleFilter = (e) => {
			// Prevent automatic closing of menu item.
			e.preventDefault();
			props.onFilterToggle(filter);
		};

		return (
			<Menu.Item
				onClick={toggleFilter}
				text={
					<Checkbox checked={checked}>{toTitleCase(filter)} items of this pub</Checkbox>
				}
			/>
		);
	});

	const menu = (
		<Menu style={{ border: `1px solid ${props.accentColor}` }}>
			<li className="bp3-menu-header">
				<h6>Include:</h6>
			</li>
			{filterMenuItems}
			<li className="bp3-menu-header">
				<h6>Show as:</h6>
			</li>
			<Menu.Item
				text={<Radio checked={props.mode === Mode.Carousel}>Carousel</Radio>}
				onClick={setCarousel}
			/>
			<Menu.Item
				text={<Radio checked={props.mode === Mode.List}>List</Radio>}
				onClick={setList}
			/>
		</Menu>
	);

	return (
		<nav className="pub-edge-listing-controls-component">
			<span>
				{props.filters.length > 0 &&
					props.filters.map((x) => pluralFilterLookup[x]).reduce(joinCommaReducer)}
			</span>
			<ButtonGroup minimal>
				{props.mode === Mode.Carousel && (
					<>
						<Button
							icon="circle-arrow-left"
							onClick={props.onBackClick}
							minimal
							small
						/>
						<Button
							icon="circle-arrow-right"
							onClick={props.onNextClick}
							minimal
							small
						/>
					</>
				)}

				{props.showFilterMenu && (
					<Popover content={menu}>
						<Button icon="filter" minimal small />
					</Popover>
				)}
			</ButtonGroup>
		</nav>
	);
};

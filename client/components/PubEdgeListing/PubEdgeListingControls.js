import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Checkbox, Menu, Popover, Radio } from '@blueprintjs/core';

import { toTitleCase, joinOxford } from '../../utils/string';
import { Mode, allFilters, filterToPlural } from './constants';

require('./pubEdgeListingControls.scss');

const propTypes = {
	accentColor: PropTypes.string.isRequired,
	filters: PropTypes.arrayOf(PropTypes.string).isRequired,
	mode: PropTypes.string.isRequired,
	showFilterMenu: PropTypes.bool,
	onNextClick: PropTypes.func.isRequired,
	onBackClick: PropTypes.func.isRequired,
	onModeChange: PropTypes.func.isRequired,
	onFilterToggle: PropTypes.func.isRequired,
	onAllFilterToggle: PropTypes.func.isRequired,
};

const defaultProps = {
	showFilterMenu: false,
};

const PubEdgeListingControls = (props) => {
	const {
		accentColor,
		filters,
		mode,
		showFilterMenu,
		onNextClick,
		onBackClick,
		onModeChange,
		onFilterToggle,
		onAllFilterToggle,
	} = props;
	const createModeHandler = (nextMode) => (e) => {
		e.preventDefault();
		onModeChange(nextMode);
	};
	const setCarousel = useCallback(createModeHandler(Mode.Carousel), [onModeChange]);
	const setList = useCallback(createModeHandler(Mode.List), [onModeChange]);
	const toggleAllFilters = useCallback(
		(e) => {
			e.preventDefault();
			onAllFilterToggle();
		},
		[onAllFilterToggle],
	);
	const filterMenuItems = allFilters
		.map((filter) => {
			const checked = filters.indexOf(filter) > -1;
			const toggleFilter = (e) => {
				// Prevent automatic closing of menu item.
				e.preventDefault();
				onFilterToggle(filter);
			};

			return (
				<Menu.Item
					onClick={toggleFilter}
					text={
						<Checkbox checked={checked}>
							{toTitleCase(filter)} items of this pub
						</Checkbox>
					}
				/>
			);
		})
		.concat(
			<Menu.Item
				onClick={toggleAllFilters}
				text={
					<Checkbox checked={filters.length === allFilters.length}>
						All related items
					</Checkbox>
				}
			/>,
		);

	const menu = (
		<Menu style={{ border: `1px solid ${accentColor}` }}>
			<li className="bp3-menu-header">
				<h6>Include:</h6>
			</li>
			{filterMenuItems}
			<li className="bp3-menu-header">
				<h6>Show as:</h6>
			</li>
			<Menu.Item
				text={<Radio checked={mode === Mode.Carousel}>Carousel</Radio>}
				onClick={setCarousel}
			/>
			<Menu.Item text={<Radio checked={mode === Mode.List}>List</Radio>} onClick={setList} />
		</Menu>
	);

	return (
		<nav className="pub-edge-listing-controls-component">
			<span>{filters.length > 0 && joinOxford(filters.map(filterToPlural))}</span>
			<ButtonGroup minimal>
				{mode === Mode.Carousel && (
					<>
						<Button icon="circle-arrow-left" onClick={onBackClick} minimal small />
						<Button icon="circle-arrow-right" onClick={onNextClick} minimal small />
					</>
				)}

				{showFilterMenu && (
					<Popover content={menu}>
						<Button icon="filter" minimal small />
					</Popover>
				)}
			</ButtonGroup>
		</nav>
	);
};

PubEdgeListingControls.propTypes = propTypes;
PubEdgeListingControls.defaultProps = defaultProps;
export default PubEdgeListingControls;

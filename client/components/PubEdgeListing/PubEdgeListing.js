import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

import { Icon, PubEdge } from 'components';
import { toTitleCase } from '../../utils/string';
import { PubEdgeListingControls } from './PubEdgeListingControls';
import { Filter, Mode } from './constants';
import { NonIdealState } from '@blueprintjs/core';

require('./pubEdgeListing.scss');

const relatedObjectType = PropTypes.shape({
	...PubEdge.propTypes,
	relationshipType: PropTypes.string.isRequired,
	pubIsParent: PropTypes.bool.isRequired,
});

const propTypes = {
	accentColor: PropTypes.string.isRequired,
	minimal: PropTypes.boolean,
	pubTitle: PropTypes.string,
	objects: PropTypes.arrayOf(relatedObjectType),
};

const filterRelatedObjects = (filters, objects) => {
	return objects.filter((o) => {
		let result = false;

		if (filters.indexOf(Filter.Parent) > -1) {
			result = result || o.pubIsParent;
		}

		if (filters.indexOf(Filter.Child) > -1) {
			result = result || !o.pubIsParent;
		}

		return result;
	});
};

const PubEdgeListingCounter = (props) => {
	return (
		<span className="pub-edge-listing-counter-component">
			{props.count === 0 ? 0 : props.index + 1} of {props.count}
		</span>
	);
};

const PubEdgeListingCard = (props) => {
	const { accentColor, children, minimal, object, pubTitle } = props;
	const relationshipName = toTitleCase(object.relationshipType);
	const relationshipTitle = minimal ? (
		<>
			<span>This pub is a </span>
			<span className="relationship-name">{relationshipName}</span> on:
		</>
	) : (
		<>
			<span>Another </span>
			<span className="relationship-name">{relationshipName}</span> of:
			<span className="pub-title"> {pubTitle}</span>
		</>
	);

	return (
		<div className="card">
			{children}
			<div className="relationship">
				{minimal && <Icon icon="arrow-drop-right" color={accentColor} iconSize={18} />}
				{relationshipTitle}
			</div>
			<PubEdge {...object} />
		</div>
	);
};

const PubEdgeListing = (props) => {
	const { accentColor, minimal = false, objects, pubTitle } = props;
	const [index, setIndex] = useState(0);
	const [mode, setMode] = useState(Mode.Carousel);
	const [filters, setFilters] = useState([Filter.Child]);
	const filteredObjects = filterRelatedObjects(filters, objects);
	const { [index]: active, length } = filteredObjects;
	const next = useCallback(() => setIndex((i) => (i + 1) % length));
	const back = useCallback(() => setIndex((i) => (i - 1 + length) % length));
	const onFilterToggle = useCallback(
		(filter) =>
			setFilters((currentFilters) => {
				const index = currentFilters.indexOf(filter);

				if (index > -1) {
					setFilters([
						...currentFilters.slice(0, index),
						...currentFilters.slice(index + 1),
					]);
				} else {
					setFilters([...currentFilters, filter]);
				}
			}),
		[],
	);

	const controls =
		objects.length > 1 ? (
			<>
				<PubEdgeListingCounter index={index} count={length} />
				<PubEdgeListingControls
					accentColor={accentColor}
					filters={filters}
					mode={mode}
					showFilterMenu={!minimal}
					onBackClick={back}
					onNextClick={next}
					onFilterToggle={onFilterToggle}
					onModeChange={setMode}
				/>
			</>
		) : null;

	return (
		<div className="pub-edge-listing-component">
			{minimal ? (
				<PubEdgeListingCard object={active} minimal={minimal} accentColor={accentColor}>
					<div className="minimal-controls">{controls}</div>
				</PubEdgeListingCard>
			) : (
				<>
					<div className="top">
						<h5 style={{ color: accentColor }}>Related Pubs</h5>
						{controls}
					</div>
					{!active || filteredObjects.length === 0 ? (
						<NonIdealState title="No Results" icon="search" />
					) : mode === Mode.Carousel ? (
						<PubEdgeListingCard
							pubTitle={pubTitle}
							object={active}
							accentColor={accentColor}
						/>
					) : (
						filteredObjects.map((o) => (
							<PubEdgeListingCard
								key={o.url}
								pubTitle={pubTitle}
								object={o}
								accentColor={accentColor}
							/>
						))
					)}
				</>
			)}
		</div>
	);
};

PubEdgeListing.propTypes = propTypes;

export default PubEdgeListing;

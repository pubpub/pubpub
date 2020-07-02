import { Icon } from '@blueprintjs/core';
import React from 'react';
import PropTypes from 'prop-types';

import { PubEdge } from 'components';
import { toTitleCase } from '../../utils/string';
import { pubEdgeType } from '../PubEdge/constants';

require('./pubEdgeListingCard.scss');

const propTypes = {
	accentColor: PropTypes.string.isRequired,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
	minimal: PropTypes.bool,
	pubEdge: pubEdgeType.isRequired,
	pubTitle: PropTypes.string,
};

const defaultProps = {
	children: [],
	minimal: false,
	pubTitle: '',
};

const PubEdgeListingCard = (props) => {
	const { accentColor, children, minimal, pubEdge, pubTitle } = props;
	const relationshipName = toTitleCase(pubEdge.relationType);
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
		<div className="pub-edge-listing-card-component">
			{children}
			<div className="relationship">
				{minimal && (
					<Icon icon="return" color={accentColor} iconSize={14} className="drop-return" />
				)}
				{relationshipTitle}
			</div>
			<PubEdge pubEdge={pubEdge} />
		</div>
	);
};

PubEdgeListingCard.propTypes = propTypes;
PubEdgeListingCard.defaultProps = defaultProps;
export default PubEdgeListingCard;

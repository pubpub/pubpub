import { Icon } from '@blueprintjs/core';
import React from 'react';
import PropTypes from 'prop-types';

import { toTitleCase } from 'utils/strings';
import { PubEdge } from 'components';

import { usePageContext } from 'utils/hooks';

import { pubEdgeType } from '../PubEdge/constants';

require('./pubEdgeListingCard.scss');

const propTypes = {
	accentColor: PropTypes.string,
	children: PropTypes.node,
	pubEdge: pubEdgeType.isRequired,
	pubTitle: PropTypes.string,
	showIcon: PropTypes.bool,
};

const defaultProps = {
	accentColor: null,
	children: [],
	pubTitle: '',
	showIcon: false,
};

const PubEdgeListingCard = (props) => {
	const { accentColor, children, pubEdge, pubTitle, showIcon } = props;
	const { communityData } = usePageContext();
	const relationshipName = toTitleCase(pubEdge.relationType);
	const relationshipTitle = pubEdge.pubIsParent ? (
		<>
			<span>This Pub is a </span>
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
		<div
			className="pub-edge-listing-card-component"
			style={{ borderColor: accentColor || communityData.accentColorDark }}
		>
			{children && <div className="controls">{children}</div>}
			<div className="relationship">
				{showIcon && (
					<Icon
						icon="key-enter"
						color={accentColor}
						iconSize={14}
						className="drop-return"
					/>
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

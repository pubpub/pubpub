import React from 'react';
import PropTypes from 'prop-types';
import { Overlay as BlueprintOverlay } from '@blueprintjs/core';

require('./overlay.scss');

const propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	maxWidth: PropTypes.string,
};

const defaultProps = {
	maxWidth: undefined,
};

const Overlay = function(props) {
	const cardStyle = props.maxWidth
		? {
			maxWidth: props.maxWidth,
			left: `calc(50vw - ${props.maxWidth / 2}px)`
		}
		: {};
	return (
		<BlueprintOverlay className="pt-overlay-scroll-container" isOpen={props.isOpen} onClose={props.onClose}>
			<div className={'overlay-wrapper pt-card pt-elevation-2'} style={cardStyle}>
				{props.children}
			</div>
		</BlueprintOverlay>
	);
};

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;
export default Overlay;

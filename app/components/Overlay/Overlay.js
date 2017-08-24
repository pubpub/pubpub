import React from 'react';
import PropTypes from 'prop-types';
import { Overlay as BlueprintOverlay } from '@blueprintjs/core';

require('./overlay.scss');

const propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,

};

const Overlay = function(props) {
	return (
		<BlueprintOverlay className="pt-overlay-scroll-container" isOpen={props.isOpen} onClose={props.onClose}>
			<div className={'overlay-wrapper pt-card pt-elevation-2'}>
				{props.children}
			</div>
		</BlueprintOverlay>
	);
};

Overlay.propTypes = propTypes;
export default Overlay;

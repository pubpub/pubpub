import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

require('./pubLinkMenu.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	editorChangeObject: PropTypes.object.isRequired,
	getAbsolutePosition: PropTypes.func.isRequired,
};

const PubLinkMenu = (props)=> {
	const activeLink = props.editorChangeObject.activeLink || {};
	// const selectionBoundingBox = props.editorChangeObject.selectionBoundingBox || {};

	if (!activeLink.attrs) { return null; }

	const menuStyle = {
		position: 'absolute',
		...props.getAbsolutePosition(activeLink.boundingBox.bottom, activeLink.boundingBox.left)
	};

	return (
		<div className="pub-link-menu-component pt-elevation-2" style={menuStyle}>
			<input
				className="pt-input"
				type="text"
				value={activeLink.attrs.href}
				onChange={(evt)=> {
					activeLink.updateAttrs({ href: evt.target.value });
				}}
			/>
			<a href={activeLink.attrs.href} target="_blank">
				Go To Link
			</a>
			<Button
				className="pt-minimal"
				text="Remove"
				onClick={activeLink.removeLink}
			/>
		</div>
	);
};


PubLinkMenu.propTypes = propTypes;
export default PubLinkMenu;

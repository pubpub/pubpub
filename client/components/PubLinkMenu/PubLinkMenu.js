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
				ref={(elem)=> {
					if (elem && !activeLink.attrs.href) {
						elem.focus();
					}
				}}
				className="pt-input"
				type="text"
				value={activeLink.attrs.href}
				onChange={(evt)=> {
					activeLink.updateAttrs({ href: evt.target.value });
				}}
			/>
			<a className="pt-button pt-minimal" href={activeLink.attrs.href} target="_blank" rel="noopener noreferrer">
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

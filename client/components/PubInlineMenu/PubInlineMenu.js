import React from 'react';
import PropTypes from 'prop-types';

require('./pubInlineMenu.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	editorChangeObject: PropTypes.object.isRequired,
	getAbsolutePosition: PropTypes.func.isRequired,
};

const PubInlineMenu = (props)=> {
	const selection = props.editorChangeObject.selection || {};
	const selectionBoundingBox = props.editorChangeObject.selectionBoundingBox || {};

	if (!props.editorChangeObject.selection || selection.empty) { return null; }

	const menuStyle = {
		position: 'absolute',
		...props.getAbsolutePosition(selectionBoundingBox.top - 30, selectionBoundingBox.left)
	};
	return (
		<div className="pub-inline-menu-component pt-elevation-2" style={menuStyle}>
			Bold · Italic · New Discussion
		</div>
	);
};


PubInlineMenu.propTypes = propTypes;
export default PubInlineMenu;

import React from 'react';
import PropTypes from 'prop-types';
import PubSideControlsIframe from 'components/PubSideControls/PubSideControlsIframe';
import PubSideControlsImage from 'components/PubSideControls/PubSideControlsImage';
import PubSideControlsVideo from 'components/PubSideControls/PubSideControlsVideo';
import PubSideControlsCitation from 'components/PubSideControls/PubSideControlsCitation';
import PubSideControlsFootnote from 'components/PubSideControls/PubSideControlsFootnote';
import PubSideControlsTable from 'components/PubSideControls/PubSideControlsTable';
import PubSideControlsEquation from 'components/PubSideControls/PubSideControlsEquation';

require('./pubSideControls.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	editorChangeObject: PropTypes.object.isRequired,
	getAbsolutePosition: PropTypes.func.isRequired,
};

const PubSideControls = (props)=> {
	const selectedNode = props.editorChangeObject.selectedNode || {};
	const selectionBoundingBox = props.editorChangeObject.selectionBoundingBox || {};
	const menuItems = props.editorChangeObject.menuItems || [];
	const isTable = menuItems.reduce((prev, curr)=> {
		if (curr.title === 'table-delete') { return true; }
		return prev;
	}, false);
	const isHorizontalRule = selectedNode.type && selectedNode.type.name === 'horizontal_rule';
	if (!props.pubData.isDraft || isHorizontalRule || (!selectedNode.attrs && !isTable)) { return null; }

	const menuStyle = {
		position: 'absolute',
		...props.getAbsolutePosition(selectionBoundingBox.top, undefined, true)
	};

	const attrs = selectedNode.attrs;
	const updateFunc = props.editorChangeObject.updateNode;
	const nodeType = selectedNode.type ? selectedNode.type.name : 'table';
	// TODO: Bug on trying to remove empty link. Firebase sync bug it looks like.
	// Inline-selection creates discussion with highlightquote pasted
	// Discussion box at bottom
	// ?Inline permalink
	// Discussions place themselves well in margin
	const controlsProps = {
		attrs: attrs,
		updateAttrs: updateFunc,
		menuItems: menuItems,
	};
	return (
		<div className="pub-side-controls-component" style={menuStyle}>
			<div className="content-wrapper">
				{nodeType === 'iframe' &&
					<PubSideControlsIframe {...controlsProps} />
				}
				{nodeType === 'image' &&
					<PubSideControlsImage {...controlsProps} />
				}
				{nodeType === 'video' &&
					<PubSideControlsVideo {...controlsProps} />
				}
				{nodeType === 'citation' &&
					<PubSideControlsCitation {...controlsProps} />
				}
				{nodeType === 'footnote' &&
					<PubSideControlsFootnote {...controlsProps} />
				}
				{nodeType === 'table' &&
					<PubSideControlsTable {...controlsProps} />
				}
				{nodeType === 'equation' &&
					<PubSideControlsEquation {...controlsProps} />
				}
				{/* TODO: Add Discussion Addon Support */}
			</div>
		</div>
	);
};


PubSideControls.propTypes = propTypes;
export default PubSideControls;

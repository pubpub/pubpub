import React from 'react';
import PropTypes from 'prop-types';
import PubSideControlsIframe from 'components/PubSideControls/PubSideControlsIframe';
import PubSideControlsImage from 'components/PubSideControls/PubSideControlsImage';

require('./pubSideControls.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	editorChangeObject: PropTypes.object.isRequired,
	getAbsolutePosition: PropTypes.func.isRequired,
};

const PubSideControls = (props)=> {
	const selectedNode = props.editorChangeObject.selectedNode || {};
	const selectionBoundingBox = props.editorChangeObject.selectionBoundingBox || {};
	if (!props.pubData.isDraft || !selectedNode.attrs) { return null; }

	const menuStyle = {
		position: 'absolute',
		...props.getAbsolutePosition(selectionBoundingBox.top, undefined, true)
	};

	const attrs = selectedNode.attrs;
	const updateFunc = props.editorChangeObject.updateNode;
	const nodeType = selectedNode.type.name;
	// TODO: Bug on trying to remove empty link. Firebase sync bug it looks like.
	// Inline-selection creates discussion with highlightquote pasted
	// Discussion box at bottom
	// ?Inline permalink
	// Discussions place themselves well in margin
	return (
		<div className="pub-side-controls-component" style={menuStyle}>
			<div className="content-wrapper">
				{nodeType === 'iframe' &&
					<PubSideControlsIframe
						attrs={attrs}
						updateAttrs={updateFunc}
					/>
				}
				{nodeType === 'image' &&
					<PubSideControlsImage
						attrs={attrs}
						updateAttrs={updateFunc}
					/>
				}
				{/*
					video
					citation
					equation
					footnote
					table
					discussionAddon
				*/}

			</div>
		</div>
	);
};


PubSideControls.propTypes = propTypes;
export default PubSideControls;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import { ButtonGroup, Button } from '@blueprintjs/core';
import {
	marksAtSelection,
	setLocalHighlight,
	removeLocalHighlight,
	convertLocalHighlightToDiscussion,
} from '@pubpub/editor';
import PubHeaderFormatting from './PubHeaderFormatting';
import PubBody from './PubBody';
import PubInlineMenu from './PubInlineMenu';
import PubLinkMenu from './PubLinkMenu';
import PubFooter from './PubFooter';
import { pubDataProps } from './sharedPropTypes';

const propTypes = {
	pubData: pubDataProps.isRequired,
	collabData: PropTypes.object.isRequired,
	firebaseBranchRef: PropTypes.object,
	updateLocalData: PropTypes.func.isRequired,
};

const defaultProps = {
	firebaseBranchRef: undefined,
};

const PubDocument = (props) => {
	const [linkPopupIsOpen, setLinkPopupIsOpen] = useState(false);
	const [clickedMarks, setClickedMarks] = useState([]);
	const [tempId, setTempId] = useState(uuidv4());

	/* Calculate whether the link popup should be open */
	const activeLink = props.collabData.editorChangeObject.activeLink || {};
	const selectionIsLink = !!activeLink.attrs;
	const clickedOnLink = clickedMarks.indexOf('link') > -1;
	const newLinkPopupIsOpen = clickedOnLink || (linkPopupIsOpen && selectionIsLink);
	if (newLinkPopupIsOpen !== linkPopupIsOpen) {
		setLinkPopupIsOpen(newLinkPopupIsOpen);
		setClickedMarks([]);
	}

	/* Manage link popup based on certain key events */
	const handleKeyPressEvents = (evt) => {
		if (linkPopupIsOpen && (evt.key === 'Escape' || evt.key === 'Enter')) {
			evt.preventDefault();
			setLinkPopupIsOpen(false);
			props.collabData.editorChangeObject.view.focus();
		}
		if (evt.key === 'k' && evt.metaKey) {
			setLinkPopupIsOpen(true);
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPressEvents);
		return () => {
			window.removeEventListener('keydown', handleKeyPressEvents);
		};
	});
	console.log(setLocalHighlight);
	return (
		<React.Fragment>
			<PubHeaderFormatting pubData={props.pubData} collabData={props.collabData} />
			<div>
				<ButtonGroup>
					<Button
						text="Prompt New Discussions"
						onClick={() => {
							const view = props.collabData.editorChangeObject.view;
							const selection = view.state.selection;
							setLocalHighlight(view, selection.from, selection.to, tempId);
						}}
					/>
					<Button
						text="Cancel New Discussions"
						onClick={() => {
							const view = props.collabData.editorChangeObject.view;
							removeLocalHighlight(view, tempId);
						}}
					/>
					<Button
						text="Save New Discussions"
						onClick={() => {
							const view = props.collabData.editorChangeObject.view;
							convertLocalHighlightToDiscussion(
								view,
								tempId,
								props.firebaseBranchRef,
							);
							setTempId(uuidv4());
						}}
					/>
				</ButtonGroup>
			</div>
			<PubBody
				pubData={props.pubData}
				collabData={props.collabData}
				firebaseBranchRef={props.firebaseBranchRef}
				updateLocalData={props.updateLocalData}
				onSingleClick={(view) => {
					/* Used to trigger link popup to open */
					/* if link mark is clicked */
					setClickedMarks(marksAtSelection(view));
				}}
			/>
			{!linkPopupIsOpen && (
				<PubInlineMenu
					pubData={props.pubData}
					collabData={props.collabData}
					openLinkMenu={() => {
						setLinkPopupIsOpen(true);
					}}
				/>
			)}
			{linkPopupIsOpen && (
				<PubLinkMenu pubData={props.pubData} collabData={props.collabData} />
			)}
			<PubFooter pubData={props.pubData} />
			{/* <PubDiscussions pubData={pubData} /> */}
		</React.Fragment>
	);
};

PubDocument.propTypes = propTypes;
PubDocument.defaultProps = defaultProps;
export default PubDocument;

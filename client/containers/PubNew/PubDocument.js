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
import GridWrapper from 'components/GridWrapper/GridWrapper';
import PubHeaderFormatting from './PubHeaderFormatting';
import PubBody from './PubBody';
import PubInlineMenu from './PubInlineMenu';
import PubLinkMenu from './PubLinkMenu';
import PubDiscussions from './PubDiscussions';
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
	const editorChangeObject = props.collabData.editorChangeObject;

	/* Calculate whether the link popup should be open */
	const activeLink = editorChangeObject.activeLink || {};
	const selectionIsLink = !!activeLink.attrs;
	const clickedOnLink = clickedMarks.indexOf('link') > -1;
	const nextLinkPopupIsOpen = clickedOnLink || (linkPopupIsOpen && selectionIsLink);
	if (nextLinkPopupIsOpen !== linkPopupIsOpen) {
		setLinkPopupIsOpen(nextLinkPopupIsOpen);
		setClickedMarks([]);
	}

	/* Manage link popup based on certain key events */
	const handleKeyPressEvents = (evt) => {
		if (linkPopupIsOpen && (evt.key === 'Escape' || evt.key === 'Enter')) {
			evt.preventDefault();
			setLinkPopupIsOpen(false);
			editorChangeObject.view.focus();
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

	return (
		<React.Fragment>
			<PubHeaderFormatting pubData={props.pubData} collabData={props.collabData} />
			<GridWrapper containerClassName="pub">
				<ButtonGroup>
					<Button
						text="Prompt New Discussion"
						onClick={() => {
							const view = editorChangeObject.view;
							const selection = view.state.selection;
							setLocalHighlight(view, selection.from, selection.to, tempId);
						}}
					/>
					<Button
						text="Cancel New Discussion"
						onClick={() => {
							const view = editorChangeObject.view;
							removeLocalHighlight(view, tempId);
						}}
					/>
					<Button
						text="Save New Discussion"
						onClick={() => {
							const view = editorChangeObject.view;
							convertLocalHighlightToDiscussion(
								view,
								tempId,
								props.firebaseBranchRef,
							);
							setTempId(uuidv4());
						}}
					/>
				</ButtonGroup>
			</GridWrapper>
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
			<PubDiscussions pubData={props.pubData} collabData={props.collabData} />
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

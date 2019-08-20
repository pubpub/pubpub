import React, { useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import { RefContent } from 'components';
import InlinePopover from './InlinePopover';
import HeaderPopover from './HeaderPopover';

const propTypes = {
	pubData: PropTypes.object.isRequired,
	collabData: PropTypes.object.isRequired,
	historyData: PropTypes.object.isRequired,
	mainContentRef: PropTypes.object.isRequired,
};

const PubMouseEvents = (props) => {
	const { pubData, collabData, historyData, mainContentRef } = props;
	const timeouts = useRef({});
	const [hoverElems, hoverElemsDispatch] = useReducer((state, action) => {
		return {
			...state,
			[action.type]: action.elem,
		};
	}, {});

	/* Specify the types of elems we want events for */
	const mouseElemTypes = [
		{ key: 'footnote', querySelector: '.footnote, .citation' },
		{ key: 'header', querySelector: 'h1, h2, h3, h4, h5, h6' },
	];

	/* Generate specific functions for all elemTypes */
	const mouseEventHandlers = mouseElemTypes.reduce((prev, curr) => {
		const key = curr.key;
		return {
			...prev,
			[key]: {
				enterHandler: (evt) => {
					clearTimeout(timeouts.current[key]);
					hoverElemsDispatch({ type: key, elem: evt.target });
				},
				leaveHandler: () => {
					timeouts.current[key] = setTimeout(() => {
						hoverElemsDispatch({ type: key, elem: undefined });
					}, 250);
				},
			},
		};
	}, {});

	/* Manage event handler binding */
	useEffect(() => {
		/* Query for all elements that will have event handlers */
		const elemQueries = mouseElemTypes.map((elemType) => {
			return document.querySelectorAll(elemType.querySelector);
		});

		/* Add event handlers */
		elemQueries.forEach((elemArray, index) => {
			const key = mouseElemTypes[index].key;
			const { enterHandler, leaveHandler } = mouseEventHandlers[key];
			elemArray.forEach((elem) => {
				elem.addEventListener('mouseenter', enterHandler);
				elem.addEventListener('mouseleave', leaveHandler);
			});
		});
		return () => {
			/* Remove event handlers */
			elemQueries.forEach((elemArray, index) => {
				const key = mouseElemTypes[index].key;
				const { enterHandler, leaveHandler } = mouseEventHandlers[key];
				elemArray.forEach((elem) => {
					elem.removeEventListener('mouseenter', enterHandler);
					elem.removeEventListener('mouseleave', leaveHandler);
				});
			});
		};
	}, [
		mouseElemTypes,
		mouseEventHandlers,
		collabData.editorChangeObject.isCollabLoaded,
		historyData.currentKey,
	]);
	const activeInlineFootnote =
		hoverElems.footnote &&
		hoverElems.footnote.getAttribute('data-node-type') === 'footnote' &&
		pubData.footnotes[Number(hoverElems.footnote.getAttribute('data-count')) - 1];
	const activeInlineCitation =
		hoverElems.footnote &&
		hoverElems.footnote.getAttribute('data-node-type') === 'citation' &&
		pubData.citations[Number(hoverElems.footnote.getAttribute('data-count')) - 1];
	const activeInlineData = activeInlineFootnote || activeInlineCitation;
	return (
		<div className="pub-mouse-events-component">
			{hoverElems.footnote && (
				<InlinePopover
					elem={hoverElems.footnote}
					mainContentRef={mainContentRef}
					timeouts={timeouts}
					mouseLeave={mouseEventHandlers.footnote.leaveHandler}
					content={
						<RefContent
							structured={activeInlineData.html}
							unstructured={activeInlineData.unstructuredValue}
						/>
					}
				/>
			)}
			{hoverElems.header && (
				<HeaderPopover
					elem={hoverElems.header}
					mainContentRef={mainContentRef}
					timeouts={timeouts}
					mouseLeave={mouseEventHandlers.header.leaveHandler}
				/>
			)}
		</div>
	);
};

PubMouseEvents.propTypes = propTypes;
export default PubMouseEvents;

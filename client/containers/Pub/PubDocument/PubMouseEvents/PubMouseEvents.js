import React, { useState, useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import InlinePopover from './InlinePopover';
import HeaderPopover from './HeaderPopover';

const propTypes = {
	collabData: PropTypes.object.isRequired,
	historyData: PropTypes.object.isRequired,
	mainContentRef: PropTypes.object.isRequired,
};

const PubMouseEvents = (props) => {
	const { collabData, historyData, mainContentRef } = props;
	const timeouts = useRef({});
	const [hoverElems, hoverElemsDispatch] = useReducer((state, action) => {
		return {
			...state,
			[action.type]: action.elem,
		};
	}, {});

	const handleMouseEnter = (key, evt) => {
		console.log('oi');
		clearTimeout(timeouts.current[key]);
		hoverElemsDispatch({ type: key, elem: evt.target });
	};

	const handleMouseLeave = (key) => {
		timeouts.current[key] = setTimeout(() => {
			hoverElemsDispatch({ type: key, elem: undefined });
		}, 250);
	};

	useEffect(() => {
		const addEvents = (elemArray, key) => {
			elemArray.forEach((elem) => {
				elem.addEventListener('mouseenter', handleMouseEnter.bind(null, key));
				elem.addEventListener('mouseleave', handleMouseLeave.bind(null, key));
			});
		};
		const removeEvents = (elemArray, key) => {
			elemArray.forEach((elem) => {
				elem.removeEventListener('mouseenter', handleMouseEnter.bind(null, key));
				elem.removeEventListener('mouseleave', handleMouseLeave.bind(null, key));
			});
		};

		const footnotes = document.querySelectorAll('.footnote, .citation');
		const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

		addEvents(footnotes, 'footnote');
		addEvents(headers, 'header');
		return () => {
			removeEvents(footnotes);
			removeEvents(headers);
		};
	}, [collabData.editorChangeObject.isCollabLoaded, historyData.currentKey]);

	return (
		<div className="pub-mouse-events-component">
			{hoverElems.footnote && (
				<InlinePopover
					elem={hoverElems.footnote}
					mainContentRef={mainContentRef}
					timeouts={timeouts}
					mouseLeave={handleMouseLeave.bind(null, 'footnote')}
					content="Weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee!"
				/>
			)}
			{hoverElems.header && (
				<HeaderPopover
					elem={hoverElems.header}
					mainContentRef={mainContentRef}
					timeouts={timeouts}
					mouseLeave={handleMouseLeave.bind(null, 'header')}
				/>
			)}
		</div>
	);
};

PubMouseEvents.propTypes = propTypes;
export default PubMouseEvents;

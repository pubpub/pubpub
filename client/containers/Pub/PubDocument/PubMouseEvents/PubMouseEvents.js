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
	// const [inlineHoverElem, setInlineHoverElem] = useState(undefined);
	// const [headerHoverElem, setHeaderHoverElem] = useState(undefined);

	// const inlineTimeout = useRef(undefined);
	// const headerTimeout = useRef(undefined);

	// const inlineMouseEnter = (evt) => {
	// 	clearTimeout(inlineTimeout.current);
	// 	setInlineHoverElem(evt.target);
	// };
	// const inlineMouseLeave = () => {
	// 	inlineTimeout.current = setTimeout(() => {
	// 		setInlineHoverElem(undefined);
	// 	}, 250);
	// };

	// const headerMouseEnter = (evt) => {
	// 	clearTimeout(headerTimeout.current);
	// 	setHeaderHoverElem(evt.target);
	// };
	// const headerMouseLeave = () => {
	// 	headerTimeout.current = setTimeout(() => {
	// 		setHeaderHoverElem(undefined);
	// 	}, 250);
	// };

	// useEffect(() => {
	// 	const footnotes = document.querySelectorAll('.footnote, .citation');
	// 	const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
	// 	footnotes.forEach((elem) => {
	// 		elem.addEventListener('mouseenter', inlineMouseEnter);
	// 		elem.addEventListener('mouseleave', inlineMouseLeave);
	// 	});
	// 	headers.forEach((elem) => {
	// 		elem.addEventListener('mouseenter', headerMouseEnter);
	// 		elem.addEventListener('mouseleave', headerMouseLeave);
	// 	});
	// 	return () => {
	// 		footnotes.forEach((elem) => {
	// 			elem.removeEventListener('mouseenter', inlineMouseEnter);
	// 			elem.removeEventListener('mouseleave', inlineMouseLeave);
	// 		});
	// 		headers.forEach((elem) => {
	// 			elem.removeEventListener('mouseenter', headerMouseEnter);
	// 			elem.removeEventListener('mouseleave', headerMouseLeave);
	// 		});
	// 	};
	// }, [collabData.editorChangeObject.isCollabLoaded, historyData.currentKey]);

	const [hoverElems, hoverElemsDispatch] = useReducer((state, action) => {
		return { ...state, [action.type]: action.elem };
	}, {});

	const timeouts = useRef({});

	const handleMouseEnter = (key, evt) => {
		// console.log('handleenter', evt, key);
		clearTimeout(timeouts.current[key]);
		hoverElemsDispatch({ type: key, elem: evt.target });
		// setHoverElems({ ...hoverElems, [key]: evt.target });
	};

	const handleMouseLeave = (key) => {
		timeouts.current[key] = setTimeout(() => {
			// setHoverElems({ ...hoverElems, [key]: undefined });
			hoverElemsDispatch({ type: key, elem: undefined });
		}, 250);
	};

	useEffect(() => {
		const footnotes = document.querySelectorAll('.footnote, .citation');
		const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

		const addEvents = (elemArray, key) => {
			// console.log(elemArray, key);
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
		addEvents(footnotes, 'footnote');
		addEvents(headers, 'header');
		return () => {
			removeEvents(footnotes);
			removeEvents(headers);
		};
	}, [collabData.editorChangeObject.isCollabLoaded, historyData.currentKey]);

	return (
		<div className="pub-mouse-events-component">
			{/*inlineHoverElem && (
				<InlinePopover
					elem={inlineHoverElem}
					mainContentRef={mainContentRef}
					timeout={inlineTimeout}
					mouseLeave={inlineMouseLeave}
					content="Weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee!"
				/>
			)*/}
			{/*headerHoverElem && (
				<HeaderPopover
					elem={headerHoverElem}
					mainContentRef={mainContentRef}
					timeout={headerTimeout}
					mouseLeave={headerMouseLeave}
				/>
			)*/}
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

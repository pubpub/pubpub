import React, { useState, useEffect } from 'react';
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
	const [inlineHoverElem, setInlineHoverElem] = useState(undefined);
	const [headerHoverElem, setHeaderHoverElem] = useState(undefined);

	const inlineMouseEnter = (evt) => {
		setInlineHoverElem(evt.target);
	};
	const inlineMouseOut = () => {
		setInlineHoverElem(undefined);
	};

	const headerMouseEnter = (evt) => {
		setHeaderHoverElem(evt.target);
	};
	const headerMouseOut = () => {
		setHeaderHoverElem(undefined);
	};

	useEffect(() => {
		const footnotes = document.querySelectorAll('.footnote, .citation');
		const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
		footnotes.forEach((elem) => {
			elem.addEventListener('mouseenter', inlineMouseEnter);
			elem.addEventListener('mouseout', inlineMouseOut);
		});
		headers.forEach((elem) => {
			elem.addEventListener('mouseenter', headerMouseEnter);
			elem.addEventListener('mouseout', headerMouseOut);
		});
		return () => {
			footnotes.forEach((elem) => {
				elem.removeEventListener('mouseenter', inlineMouseEnter);
				elem.removeEventListener('mouseout', inlineMouseOut);
			});
			headers.forEach((elem) => {
				elem.removeEventListener('mouseenter', headerMouseEnter);
				elem.removeEventListener('mouseout', headerMouseOut);
			});
		};
	}, [collabData.editorChangeObject.isCollabLoaded, historyData.currentKey]);

	return (
		<div className="pub-mouse-events-component">
			{inlineHoverElem && (
				<InlinePopover
					elem={inlineHoverElem}
					mainContentRef={mainContentRef}
					content="Weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee!"
				/>
			)}
			{headerHoverElem && (
				<HeaderPopover
					elem={headerHoverElem}
					mainContentRef={mainContentRef}
				/>
			)}
		</div>
	);
};

PubMouseEvents.propTypes = propTypes;
export default PubMouseEvents;

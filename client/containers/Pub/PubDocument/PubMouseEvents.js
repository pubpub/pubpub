import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Popper from 'popper.js';
import { Card } from '@blueprintjs/core';

const propTypes = {
	collabData: PropTypes.object.isRequired,
	historyData: PropTypes.object.isRequired,
	mainContentRef: PropTypes.object.isRequired,
};

const Popped = (props) => {
	const ref = useRef();
	useEffect(() => {
		if (!props.elem) {
			return () => {};
		}
		/* eslint-disable-next-line no-new */
		const thing = new Popper(props.elem, ref.current, {
			placement: 'top-start',
			modifiers: {
				flip: {
					behavior: 'flip',
				},
				preventOverflow: {
					boundariesElement: props.mainContentRef.current,
				},
			},
		});
		return () => {
			thing.destroy();
		};
	}, [props.elem, props.mainContentRef]);
	if (!props.elem) {
		return null;
	}
	return (
		<div ref={ref} style={{ position: 'absolute', top: '-9999px' }}>
			<Card elevation={2}>Weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee!</Card>
		</div>
	);
};
Popped.propTypes = { elem: PropTypes.object, mainContentRef: PropTypes.object.isRequired };
Popped.defaultProps = { elem: null };

const PubMouseEvents = (props) => {
	const { collabData, historyData, mainContentRef } = props;
	const [activeHover, setActiveHover] = useState(undefined);

	const onMouseEnter = (evt) => {
		setActiveHover(evt.target);
	};
	const onMouseOut = () => {
		setActiveHover(undefined);
	};
	useEffect(() => {
		const footnotes = document.querySelectorAll('.footnote');

		footnotes.forEach((elem) => {
			elem.addEventListener('mouseenter', onMouseEnter);
			elem.addEventListener('mouseout', onMouseOut);
		});
		return () => {
			footnotes.forEach((elem) => {
				elem.removeEventListener('mouseenter', onMouseEnter);
				elem.removeEventListener('mouseout', onMouseOut);
			});
		};
	}, [collabData.editorChangeObject.isCollabLoaded, historyData.currentKey]);

	return (
		<div className="pub-mouse-events-component">
			<Popped elem={activeHover} mainContentRef={mainContentRef} />
		</div>
	);
};

PubMouseEvents.propTypes = propTypes;
export default PubMouseEvents;

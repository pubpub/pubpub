import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Popper from 'popper.js';
import { Card } from '@blueprintjs/core';

const propTypes = {
	elem: PropTypes.object.isRequired,
	mainContentRef: PropTypes.object.isRequired,
	timeouts: PropTypes.object.isRequired,
	mouseLeave: PropTypes.func.isRequired,
	content: PropTypes.node,
};
const defaultProps = {
	content: undefined,
};

const InlinePopover = (props) => {
	const { elem, mainContentRef, content, timeouts, mouseLeave } = props;
	const popoverRef = useRef();
	useEffect(() => {
		const popperObject = new Popper(elem, popoverRef.current, {
			placement: 'top-start',
			modifiers: {
				flip: {
					behavior: 'flip',
				},
				preventOverflow: {
					boundariesElement: mainContentRef.current,
				},
			},
		});
		return () => {
			popperObject.destroy();
		};
	}, [elem, mainContentRef, popoverRef]);

	const inlinePopoverMouseEnter = () => {
		clearTimeout(timeouts.current.footnote);
	};

	useEffect(() => {
		const popoverElem = popoverRef.current;
		if (!popoverElem) {
			return () => {};
		}
		popoverElem.addEventListener('mouseenter', inlinePopoverMouseEnter);
		popoverElem.addEventListener('mouseleave', mouseLeave);
		return () => {
			popoverElem.removeEventListener('mouseenter', inlinePopoverMouseEnter);
			popoverElem.removeEventListener('mouseleave', mouseLeave);
		};
	});

	return (
		<div ref={popoverRef} style={{ position: 'absolute', top: '-9999px' }}>
			<Card elevation={2}>{content}</Card>
		</div>
	);
};
InlinePopover.propTypes = propTypes;
InlinePopover.defaultProps = defaultProps;
export default InlinePopover;

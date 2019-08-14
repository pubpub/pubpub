import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Popper from 'popper.js';
import { Card } from '@blueprintjs/core';

const propTypes = {
	elem: PropTypes.object.isRequired,
	mainContentRef: PropTypes.object.isRequired,
	content: PropTypes.node,
};
const defaultProps = {
	content: undefined,
};

const InlinePopover = (props) => {
	const { elem, mainContentRef, content } = props;
	const ref = useRef();
	useEffect(() => {
		const popperObject = new Popper(elem, ref.current, {
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
	}, [elem, mainContentRef]);

	return (
		<div ref={ref} style={{ position: 'absolute', top: '-9999px' }}>
			<Card elevation={2}>{content}</Card>
		</div>
	);
};
InlinePopover.propTypes = propTypes;
InlinePopover.defaultProps = defaultProps;
export default InlinePopover;

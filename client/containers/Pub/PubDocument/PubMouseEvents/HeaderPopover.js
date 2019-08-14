import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Popper from 'popper.js';
import { Button } from '@blueprintjs/core';

const propTypes = {
	elem: PropTypes.object.isRequired,
	mainContentRef: PropTypes.object.isRequired,
};

const HeaderPopover = (props) => {
	const { elem, mainContentRef } = props;
	const ref = useRef();
	useEffect(() => {
		const popperObject = new Popper(elem, ref.current, {
			placement: 'left',
		});
		return () => {
			popperObject.destroy();
		};
	}, [elem, mainContentRef]);

	return (
		<div ref={ref} style={{ position: 'absolute', top: '-9999px' }}>
			<Button minimal icon="link" />
		</div>
	);
};
HeaderPopover.propTypes = propTypes;
export default HeaderPopover;

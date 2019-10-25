import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Classes } from '@blueprintjs/core';
import * as RK from 'reakit/Menu';

import { MenuContext } from './menuContext';

const propTypes = {
	children: PropTypes.node.isRequired,
	disclosure: PropTypes.func.isRequired,
	placement: PropTypes.string,
	gutter: PropTypes.number,
};

const defaultProps = {
	gutter: undefined,
	placement: undefined,
};

export const Menu = (props) => {
	const { children, disclosure, placement, gutter } = props;
	const menu = RK.useMenuState({
		placement: placement,
		gutter: gutter,
		unstable_preventOverflow: false,
	});
	return (
		<React.Fragment>
			<RK.MenuDisclosure
				style={{ display: 'inline-block', '-webkit-appearance': 'unset' }}
				{...menu}
			>
				{(disclosureProps) => disclosure(disclosureProps)}
			</RK.MenuDisclosure>
			<RK.Menu
				as="ul"
				style={{ zIndex: 1 }}
				className={classNames(Classes.MENU, Classes.ELEVATION_1)}
				unstable_portal={true}
				{...menu}
			>
				<MenuContext.Provider value={menu}>{children}</MenuContext.Provider>
			</RK.Menu>
		</React.Fragment>
	);
};

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;

import React from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

require('./dropdownRichItem.scss');

const propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string,
	description: PropTypes.string,
	hideBottomBorder: PropTypes.bool,
};

const defaultProps = {
	label: undefined,
	description: undefined,
	hideBottomBorder: false,
};

const DropdownRichItem = function(props) {
	return (
		<div className={`dropdown-rich-item ${props.hideBottomBorder ? 'no-border' : ''} pt-menu-item pt-popover-dismiss`}>
			{props.icon &&
				<span className={`pt-icon-standard ${props.icon}`} />
			}

			<div className={'title'}>{props.title}</div>
			
			{props.description &&
				<div className={'description'}>{props.description}</div>
			}
			
		</div>
	);
};

DropdownRichItem.defaultProps = defaultProps;
DropdownRichItem.propTypes = propTypes;
export default DropdownRichItem;

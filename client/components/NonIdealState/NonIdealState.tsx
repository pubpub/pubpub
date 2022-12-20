import React from 'react';
import PropTypes from 'prop-types';
import { Classes, Icon } from '@blueprintjs/core';

require('./nonIdealState.scss');

const propTypes = {
	title: PropTypes.string,
	icon: PropTypes.string,
	action: PropTypes.node,
	description: PropTypes.string,
	children: PropTypes.node,
	className: PropTypes.string,
};

const defaultProps = {};

const NonIdealState = function (props) {
	return (
		<div className={`${props.className} ${Classes.NON_IDEAL_STATE}`}>
			{props.icon && (
				<div className={Classes.NON_IDEAL_STATE_VISUAL}>
					<Icon icon={props.icon} iconSize={60} />
				</div>
			)}
			{props.title && <div className={Classes.HEADING}>{props.title}</div>}
			{props.description && <div>{props.description}</div>}
			{props.action && <>{props.action}</>}
			{props.children && <>{props.children}</>}
		</div>
	);
};

NonIdealState.propTypes = propTypes;
NonIdealState.defaultProps = defaultProps;
export default NonIdealState;

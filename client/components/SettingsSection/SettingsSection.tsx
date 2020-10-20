import React from 'react';
import PropTypes from 'prop-types';
import { slugifyString } from 'utils/strings';

require('./settingsSection.scss');

const propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	children: PropTypes.node,
};

const defaultProps = {
	className: '',
	title: '',
	children: undefined,
};

const SettingsSection = function(props) {
	return (
		<div
			className={`settings-section-component ${props.className}`}
			id={slugifyString(props.title)}
		>
			<div className="title">{props.title}</div>
			<div className="content">{props.children}</div>
		</div>
	);
};

SettingsSection.defaultProps = defaultProps;
SettingsSection.propTypes = propTypes;
export default SettingsSection;

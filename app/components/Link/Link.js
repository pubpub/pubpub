import React from 'react';
import PropTypes from 'prop-types';
import { Link as ReactRouterLink } from 'react-router-dom';

const propTypes = {
	to: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	]).isRequired,
};

const Link = function(props) {
	const isExternal = typeof props.to === 'string' && /^https?:\/\//.test(props.to);
	if (isExternal) {
		return <a href={props.to} {...props} />;
	}
	return <ReactRouterLink {...props} />;
};

Link.propTypes = propTypes;
export default Link;

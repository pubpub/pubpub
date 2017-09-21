/* eslint-disable react/no-unused-prop-types */import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	width: PropTypes.string,
	height: PropTypes.string,
	borderRadius: PropTypes.string,
	margin: PropTypes.string,
	float: PropTypes.string,
};
const defaultProps = {
	width: 300,
	height: 25,
	borderRadius: 2,
	margin: '0em 0em 1em',
	float: 'none',
};

const Loading = function(props) {
	return (
		<div className={'loading pt-skeleton'} style={props} />
	);
};

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;
export default Loading;

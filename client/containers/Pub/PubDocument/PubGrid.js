import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	children: PropTypes.node.isRequired,
};

require('./pubGrid.scss');

const PubGrid = (props) => {
	const { children } = props;
	return <div className="pub-grid-component">{children}</div>;
};

PubGrid.propTypes = propTypes;
export default PubGrid;

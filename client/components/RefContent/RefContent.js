import React from 'react';
import PropTypes from 'prop-types';

require('./refContent.scss');

const propTypes = {
	structured: PropTypes.string,
	unstructured: PropTypes.string,
};

const defaultProps = {
	structured: '',
	unstructured: '',
};

const RefContent = (props) => {
	const { structured, unstructured } = props;
	return (
		<span className="ref-content-component">
			<span dangerouslySetInnerHTML={{ __html: structured }} />
			<span dangerouslySetInnerHTML={{ __html: unstructured }} />
		</span>
	);
};
RefContent.propTypes = propTypes;
RefContent.defaultProps = defaultProps;
export default RefContent;

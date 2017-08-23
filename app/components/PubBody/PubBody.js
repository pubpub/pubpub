import React from 'react';
import PropTypes from 'prop-types';

require('./pubBody.scss');

const propTypes = {
	content: PropTypes.node.isRequired,
};

const PubBody = function(props) {
	return (
		<div className={'pub-body'}>
			<div className={'container pub'}>
				<div className={'row'}>
					<div className={'col-12'}>
						{props.content}
					</div>
				</div>
			</div>
		</div>
	);
};

PubBody.propTypes = propTypes;
export default PubBody;

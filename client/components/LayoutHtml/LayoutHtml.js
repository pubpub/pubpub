import React from 'react';
import PropTypes from 'prop-types';

require('./layoutHtml.scss');

const propTypes = {
	content: PropTypes.object.isRequired,
	/* Expected content */
	/* title, html */
};

const LayoutHtml = function(props) {
	if (!props.content.html && !props.content.title) { return null; }
	return (
		<div className="layout-html-component">
			<div className="block-content">
				{props.content.title &&
					<div className="row">
						<div className="col-12">
							<h3>{props.content.title}</h3>
						</div>
					</div>
				}
				<div className="row">
					<div className="col-12">
						<div dangerouslySetInnerHTML={{ __html: props.content.html }} />
					</div>
				</div>
			</div>
		</div>
	);
};

LayoutHtml.propTypes = propTypes;
export default LayoutHtml;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { externalPublicationType } from './constants';

require('./pubEdge.scss');

const propTypes = {
	externalPublication: externalPublication.isRequired,
};
const defaultProps = {};

const PubEdgePreview = (props) => {
	const {
		externalPublication: { title, description, contributors, avatar, url, publicationDate },
	} = props;
	return (
		<div className="pub-edge-preview-component">
			<div className="top">
                {avatar && <d
				<a href={url} tabIndex="-1">
					<img src={avatar} alt="" />
				</a>
			</div>
		</div>
	);
};

PubEdgePreview.propTypes = propTypes;
PubEdgePreview.defaultProps = defaultProps;
export default PubEdgePreview;

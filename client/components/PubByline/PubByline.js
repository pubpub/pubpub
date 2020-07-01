import PropTypes from 'prop-types';
import React from 'react';

import { Byline } from 'components';
import { getAllPubContributors } from 'utils/pubContributors';

const { contributors, ...bylinePropTypesWithoutContributors } = Byline.propTypes;
const propTypes = {
	pubData: PropTypes.shape({}).isRequired,
	...bylinePropTypesWithoutContributors,
};

const PubByline = (props) => {
	const { pubData, hideAuthors, hideContributors } = props;
	const authors = getAllPubContributors(pubData, hideAuthors, hideContributors);

	return <Byline {...props} contributors={authors} />;
};

PubByline.propTypes = propTypes;
PubByline.defaultProps = Byline.defaultProps;
export default PubByline;

import PropTypes from 'prop-types';
import React from 'react';

import { Byline } from 'components';
import { getAllPubContributors } from 'utils/pubContributors';
import { propTypes as bylinePropTypes } from '../Byline/Byline';

const { contributors, ...bylinePropTypesWithoutContributors } = bylinePropTypes;
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

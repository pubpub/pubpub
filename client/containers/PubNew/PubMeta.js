import React, { useContext } from 'react';
import { PageContext } from 'components/PageWrapper/PageWrapper';
import GridWrapper from 'components/GridWrapper/GridWrapper';
import { pubDataProps } from './sharedPropTypes';

require('./pubMeta.scss');

const propTypes = {
	pubData: pubDataProps.isRequired,
};

const PubMeta = (props) => {
	const { pubData } = props;
	if (!pubData.metaMode) {
		return null;
	}
	return (
		<div className="pub-meta-component">
			<GridWrapper containerClassName="pub">
				<h3>{pubData.metaMode}</h3>
			</GridWrapper>
		</div>
	);
};

PubMeta.propTypes = propTypes;
export default PubMeta;

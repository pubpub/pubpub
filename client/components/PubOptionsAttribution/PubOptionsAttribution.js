import React from 'react';
import PropTypes from 'prop-types';

import AttributionEditor from '../AttributionEditor/AttributionEditor';

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	setPubData: PropTypes.func.isRequired,
};

class PubOptionsAttribution extends React.Component {
	constructor(props) {
		super(props);
		this.handleUpdateAttributions = this.handleUpdateAttributions.bind(this);
	}

	handleUpdateAttributions(newAttributions) {
		const { pubData, setPubData } = this.props;
		setPubData({
			...pubData,
			attributions: newAttributions,
		});
	}

	render() {
		const { communityData, pubData } = this.props;
		return (
			<AttributionEditor
				apiRoute="/api/pubAttributions"
				identifyingProps={{
					communityId: communityData.id,
					pubId: pubData.id,
				}}
				attributions={pubData.attributions}
				canEdit={pubData.isManager}
				communityData={communityData}
				onUpdateAttributions={this.handleUpdateAttributions}
			/>
		);
	}
}

PubOptionsAttribution.propTypes = propTypes;
export default PubOptionsAttribution;

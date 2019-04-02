import React from 'react';
import PropTypes from 'prop-types';
import { apiFetch } from 'utilities';

require('./pubOptionsDoi.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	// loginData: PropTypes.object.isRequired,
	setPubData: PropTypes.func.isRequired,
};

class PubOptionsDoi extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			justSetDoi: false,
		};
		this.handleAssignDoi = this.handleAssignDoi.bind(this);
	}

	handleAssignDoi() {
		const { pubData, communityData } = this.props;
		this.setState({ isLoading: true });
		return apiFetch('/api/doi', {
			method: 'POST',
			body: JSON.stringify({
				pubId: pubData.id,
				communityId: communityData.id,
				versionId: pubData.activeVersion.id,
			}),
		})
			.then((updatedPubData) => {
				this.setState({ isLoading: false });
				this.props.setPubData({
					...this.props.pubData,
					...updatedPubData,
				});
			})
			.catch(() => {
				this.setState({ isLoading: false });
			});
	}

	render() {
		return null;
	}
}

PubOptionsDoi.propTypes = propTypes;
export default PubOptionsDoi;

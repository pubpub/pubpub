import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./pubNew.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
};

class PubNew extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'pub',
		};
	}


	render() {
		return (
			<div id="pub-new-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
				>
					<h1>Hello</h1>
				</PageWrapper>
			</div>
		);
	}
}

PubNew.propTypes = propTypes;
export default PubNew;

hydrateWrapper(PubNew);

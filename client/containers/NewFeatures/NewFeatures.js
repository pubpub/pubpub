import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./newFeatures.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const NewFeatures = (props)=> {
	return (
		<div id="new-features-container">
			<PageWrapper
				loginData={props.loginData}
				communityData={props.communityData}
				locationData={props.locationData}
			>
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h1>Features</h1>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

NewFeatures.propTypes = propTypes;
export default NewFeatures;

hydrateWrapper(NewFeatures);

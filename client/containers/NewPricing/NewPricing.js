import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./newPricing.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const NewPricing = (props)=> {
	return (
		<div id="new-pricing-container">
			<PageWrapper
				loginData={props.loginData}
				communityData={props.communityData}
				locationData={props.locationData}
			>
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h1>Pricing</h1>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

NewPricing.propTypes = propTypes;
export default NewPricing;

hydrateWrapper(NewPricing);

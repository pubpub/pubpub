import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./newAbout.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const NewAbout = (props)=> {
	return (
		<div id="new-about-container">
			<PageWrapper
				loginData={props.loginData}
				communityData={props.communityData}
				locationData={props.locationData}
			>
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h1>About</h1>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

NewAbout.propTypes = propTypes;
export default NewAbout;

hydrateWrapper(NewAbout);

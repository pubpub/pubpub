import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./newContact.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const NewContact = (props)=> {
	return (
		<div id="new-contact-container">
			<PageWrapper
				loginData={props.loginData}
				communityData={props.communityData}
				locationData={props.locationData}
			>
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h1>Contact</h1>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

NewContact.propTypes = propTypes;
export default NewContact;

hydrateWrapper(NewContact);

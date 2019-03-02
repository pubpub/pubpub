import React from 'react';
import PropTypes from 'prop-types';
import Editor from '@pubpub/editor';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import discussionSchema from 'components/DiscussionAddon/discussionSchema';
import { hydrateWrapper, getResizedUrl } from 'utilities';

require('./pubTest.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
};

const PubTest = (props) => {
	return (
		<div id="pub-test-container">
			<PageWrapper
				loginData={props.loginData}
				communityData={props.communityData}
				locationData={props.locationData}
			>
				<Editor
					customNodes={{
						...discussionSchema,
					}}
					nodeOptions={{
						image: {
							onResizeUrl: (url) => {
								return getResizedUrl(url, 'fit-in', '800x0');
							},
						},
					}}
					placeholder="Begin Writing"
					initialContent={props.pubData.content}
				/>
			</PageWrapper>
		</div>
	);
};

PubTest.propTypes = propTypes;
export default PubTest;

hydrateWrapper(PubTest);

import React from 'react';
import { storiesOf } from '@storybook/react';
import PubPresDetails from 'components/PubPresDetails/PubPresDetails';
import { pubData, pubVersions } from './_data';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };

storiesOf('PubPresDetails', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<PubPresDetails
				collaborators={pubData.contributors}
				slug={pubData.slug}
				numDiscussions={10}
				numSuggestions={8}
				versions={pubVersions}
			/>
		</div>
	</div>
));

import React from 'react';
import { storiesOf } from '@storybook/react';
import PubPresDetails from 'components/PubPresDetails/PubPresDetails';
import { pubData } from './_data';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };

storiesOf('PubPresDetails', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<PubPresDetails
				collaborators={pubData.collaborators}
				slug={pubData.slug}
				numDiscussions={pubData.discussions.length}
				numSuggestions={pubData.discussions.reduce((prev, curr)=> {
					if (curr.suggestions) { return prev + 1; }
					return prev;
				}, 0)}
				versions={pubData.versions}
			/>
		</div>
	</div>
));

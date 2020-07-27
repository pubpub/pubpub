import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import Byline from './Byline';

const [A, B, C, D, E, F, G] = [
	'Allyson Maxwell',
	'Li Boyi',
	'Carlos Montilla Vásquez',
	'邓京瀚',
	'Enyinnaya Uchie',
	'Frances van der Hagen',
	'Geum Kyung-Sam',
].map((name, index) => {
	return {
		id: `attribution-${index}`,
		user: {
			id: `user-${index}`,
			fullName: name,
			slug: name
				.toLowerCase()
				.split(' ')
				.join('-'),
		},
	};
});

storiesOf('components/Byline', module).add('default', () => {
	const [truncation, setTruncation] = useState(4);
	return (
		<div style={{ margin: '1em' }}>
			<h4>Basic</h4>
			<p>
				<Byline contributors={[A, B, C, D]} />
			</p>
			<h4 style={{ display: 'flex', alignItems: 'center' }}>
				Truncated at number of users ({truncation})
				<input
					style={{ marginLeft: '1em' }}
					type="range"
					min="0"
					max="7"
					value={truncation.toString()}
					onChange={(e) => setTruncation(parseInt(e.target.value, 10))}
				/>
			</h4>
			<p>
				<Byline contributors={[A, B, C, D, E, F, G]} truncateAt={truncation} />
			</p>
			<h4>No linking to users</h4>
			<p>
				<Byline contributors={[C, F, E, A]} linkToUsers={false} />
			</p>
			<h4>No prefix</h4>
			<p>
				<Byline contributors={[G, A, B, C]} linkToUsers={false} bylinePrefix={null} />
			</p>
			<h4>Custom empty state</h4>
			<p>
				<Byline contributors={[]} renderEmptyState={() => 'No contributors 😥'} />
			</p>
			<h4>Custom suffix</h4>
			<p>
				<Byline
					contributors={[B, F, G, E]}
					renderSuffix={() => <button type="button">Add more</button>}
				/>
			</p>
			<h4>Custom user labels</h4>
			<p>
				<Byline
					contributors={[C, A, B, D]}
					bylinePrefix={null}
					linkToUsers={false}
					renderUserLabel={(user, index) => `(${index + 1}) ${user.fullName}`}
				/>
			</p>
			<h4>Use ampersand</h4>
			<p>
				<Byline contributors={[B, F, G, E]} ampersand />
			</p>
		</div>
	);
});

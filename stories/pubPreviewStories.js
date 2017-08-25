import React from 'react';
import { storiesOf } from '@storybook/react';
import PubPreview from 'components/PubPreview/PubPreview';

const contributors = [1, 2, 3, 4, 5];
const authors = [
	{
		id: 0,
		userInitials: 'TR',
		userAvatar: '/dev/trich.jpg',
	},
	{
		id: 1,
		userInitials: 'MW',
	},
	{
		id: 2,
		userInitials: 'TW',
		userAvatar: '/dev/tomer.jpg',
	},
];

storiesOf('PubPreview', module)
.add('Default', () => (
	<div className={'container'}>
		<div className={'row'}>
			<div className={'col-12'}>
				<PubPreview
					title={'Super Glue Data Engine'}
					description={'Media data accessible through APIs to build diverse applications'}
					slug={'my-article'}
					bannerImage={'/dev/banner1.jpg'}
					isLarge={true}
					publicationDate={String(new Date())}
					contributors={contributors}
					authors={authors}
				/>
			</div>
		</div>
		<div className={'row'}>
			<div className={'col-12'}>
				<PubPreview
					title={'Super Glue Data Engine'}
					description={'Media data accessible through APIs to build diverse applications'}
					slug={'my-article'}
					bannerImage={'/dev/banner1.jpg'}
					isLarge={false}
					publicationDate={String(new Date())}
					contributors={contributors}
					authors={authors}
				/>
			</div>
		</div>
		<div className={'row'}>
			<div className={'col-12'}>
				<PubPreview
					title={'Super Glue Data Engine'}
					description={'Media data accessible through APIs to build diverse applications'}
					slug={'my-article'}
					bannerImage={'/dev/banner2.jpg'}
					isLarge={false}
					publicationDate={String(new Date())}
					contributors={[]}
					authors={[authors[2]]}
				/>
			</div>
		</div>
	</div>
));

import React from 'react';
import { storiesOf } from '@storybook/react';
import PubPreview from 'components/PubPreview/PubPreview';
import { collectionData } from './_data';

// const collaborators = [1, 2, 3, 4, 5];
// const authors = [
// 	{
// 		id: 0,
// 		userInitials: 'TR',
// 		userAvatar: '/dev/trich.jpg',
// 	},
// 	{
// 		id: 1,
// 		userInitials: 'MW',
// 	},
// 	{
// 		id: 2,
// 		userInitials: 'TW',
// 		userAvatar: '/dev/tomer.jpg',
// 	},
// ];

storiesOf('PubPreview', module)
.add('Default', () => (
	<div className={'container'}>
		<h1 style={{ margin: '0em 0em 0.5em' }}>Large</h1>
		<div className={'row'}>
			<div className={'col-12'}>
				<PubPreview
					title={collectionData.pubs[0].title}
					description={collectionData.pubs[0].description}
					slug={collectionData.pubs[0].slug}
					bannerImage={collectionData.pubs[0].avatar}
					size={'large'}
					publicationDate={collectionData.pubs[0].firstPublishedAt}
					collaborators={collectionData.pubs[0].collaborators}
					authors={collectionData.pubs[0].collaborators.filter((item)=> { return item.Collaborator.isAuthor; })}
				/>
			</div>
			<div className={'col-12'}>
				<PubPreview
					size={'large'}
				/>
			</div>
		</div>
		<h1 style={{ margin: '2em 0em 0.5em' }}>Medium</h1>
		<div className={'row'}>
			<div className={'col-6'}>
				<PubPreview
					title={collectionData.pubs[1].title}
					description={collectionData.pubs[1].description}
					slug={collectionData.pubs[1].slug}
					bannerImage={collectionData.pubs[1].avatar}
					size={'medium'}
					publicationDate={collectionData.pubs[1].firstPublishedAt}
					collaborators={collectionData.pubs[1].collaborators}
					authors={collectionData.pubs[1].collaborators.filter((item)=> { return item.Collaborator.isAuthor; })}
				/>
			</div>
			<div className={'col-6'}>
				<PubPreview
					title={collectionData.pubs[2].title}
					description={collectionData.pubs[2].description}
					slug={collectionData.pubs[2].slug}
					bannerImage={collectionData.pubs[2].avatar}
					size={'medium'}
					publicationDate={collectionData.pubs[2].firstPublishedAt}
					collaborators={collectionData.pubs[2].collaborators}
					authors={collectionData.pubs[2].collaborators.filter((item)=> { return item.Collaborator.isAuthor; })}
				/>
			</div>
			<div className={'col-6'}>
				<PubPreview
					size={'medium'}
				/>
			</div>
			<div className={'col-6'}>
				<PubPreview
					size={'medium'}
				/>
			</div>
		</div>
		{/*<div className={'row'}>
			<div className={'col-12'}>
				<PubPreview
					title={'Super Glue Data Engine'}
					description={'Media data accessible through APIs to build diverse applications'}
					slug={'my-article'}
					bannerImage={'/dev/banner1.jpg'}
					isLarge={false}
					publicationDate={String(new Date())}
					collaborators={collaborators}
					authors={authors}
				/>
			</div>
		</div>*/}
		<h1 style={{ margin: '2em 0em 0.5em' }}>Small</h1>
		<div className={'row'}>
			<div className={'col-12'}>
				<PubPreview
					title={collectionData.pubs[0].title}
					description={collectionData.pubs[0].description}
					slug={collectionData.pubs[0].slug}
					bannerImage={collectionData.pubs[0].avatar}
					size={'small'}
					publicationDate={collectionData.pubs[0].firstPublishedAt}
					collaborators={collectionData.pubs[0].collaborators}
					authors={collectionData.pubs[0].collaborators.filter((item)=> { return item.Collaborator.isAuthor; })}
				/>
			</div>
			<div className={'col-12'}>
				<PubPreview
					size={'small'}
				/>
			</div>
		</div>
		<h1 style={{ margin: '2em 0em 0.5em' }}>Placeholder</h1>
		<div className={'row'}>
			<div className={'col-12'}>
				<PubPreview
					size={'large'}
					isPlaceholder={true}
				/>
			</div>
		</div>
		<div className={'row'}>
			<div className={'col-6'}>
				<PubPreview
					title={'A sample title for placeholder'}
					size={'medium'}
					isPlaceholder={true}
				/>
			</div>
			<div className={'col-6'}>
				<PubPreview
					title={'A sample title for placeholder'}
					size={'medium'}
					isPlaceholder={true}
					inputContent={<input className={'pt-input pt-fill'} type={'text'} />}
				/>
			</div>
		</div>
		{/*<div className={'row'}>
			<div className={'col-12'}>
				<PubPreview
					title={'Super Glue Data Engine'}
					description={'Media data accessible through APIs to build diverse applications'}
					slug={'my-article'}
					bannerImage={'/dev/banner2.jpg'}
					isLarge={false}
					publicationDate={String(new Date())}
					collaborators={[]}
					authors={[authors[2]]}
				/>
			</div>
		</div>
		<div className={'row'}>
			<div className={'col-12'}>
				<PubPreview
					title={'Super Glue Data Engine'}
					description={'Media data accessible through APIs to build diverse applications. Media data accessible through APIs to build diverse applications. Media data accessible through APIs to build diverse applications. Media data accessible through APIs to build diverse applications'}
					slug={'my-article'}
					bannerImage={'/dev/banner2.jpg'}
					isLarge={false}
					publicationDate={String(new Date())}
					collaborators={[]}
					authors={[authors[2]]}
					isMinimal={true}
				/>
			</div>
		</div>*/}
		{/*<div className={'row'}>
			<div className={'col-12'}>
				<PubPreviewLoading />
			</div>
		</div>*/}
	</div>
));

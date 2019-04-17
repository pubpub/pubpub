import * as React from 'react';
import { storiesOf } from '@storybook/react';
import CollectionMetadataEditor from 'components/CollectionMetadataEditor/CollectionMetadataEditor';
import { collectionData, communityData } from 'data';

storiesOf('Components/Collections/CollectionMetadataEditor', module).add('default', () => (
	<CollectionMetadataEditor
		collection={collectionData}
		communityData={communityData}
		onPersistStateChange={() => {}}
		onCollectionUpdate={() => {}}
	/>
));

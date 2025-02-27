import React, { useState } from 'react';
import { useUpdateEffect } from 'react-use';

import { usePageContext } from 'utils/hooks';
import { getDashUrl } from 'utils/dashboard';
import { CollectionAttributionEditor, SettingsSection } from 'components';
import { pruneFalsyValues } from 'utils/arrays';
import { AttributionWithUser, DepositTarget } from 'types';
import Deposit from 'client/components/Deposit/Deposit';

import { useCollectionState } from '../../DashboardOverview/CollectionOverview/collectionState';
import CommunityOrCollectionLevelPubSettings from '../CommunitySettings/CommunityOrCollectionLevelPubSettings';
import CollectionDetailsEditor from './CollectionDetailsEditor';
import CollectionMetadataEditor from './CollectionMetadataEditor';
import DashboardSettingsFrame, { Subtab } from '../DashboardSettingsFrame';

type Props = {
	settingsData: {
		depositTarget?: DepositTarget | null;
	};
};

const CollectionSettings = (props: Props) => {
	const {
		settingsData: { depositTarget },
	} = props;
	const {
		communityData,
		scopeData: {
			elements: { activeCollection },
		},
	} = usePageContext();
	const {
		collection,
		updateCollection,
		deleteCollection,
		slugStatus,
		hasChanges,
		persistCollection,
	} = useCollectionState(activeCollection!);
	const [collectionAttributions, setCollectionAttributions] = useState<AttributionWithUser[]>(
		collection.attributions as AttributionWithUser[],
	);

	useUpdateEffect(() => {
		if (!hasChanges) {
			window.history.replaceState(
				{},
				'',
				getDashUrl({ collectionSlug: collection.slug, mode: 'settings' }),
			);
		}
	}, [collection.slug, hasChanges]);

	const tabs: Subtab[] = pruneFalsyValues([
		{
			id: 'details',
			title: 'Details',
			icon: 'settings',
			sections: [
				<CollectionDetailsEditor
					slugStatus={slugStatus}
					communityData={communityData}
					collection={collection}
					onUpdateCollection={updateCollection}
					onDeleteCollection={() =>
						deleteCollection().then(() => {
							window.location.href = getDashUrl({});
						})
					}
				/>,
			],
		},
		collection.kind !== 'tag' && {
			id: 'metadata',
			title: 'Metadata',
			icon: 'heat-grid',
			sections: [
				<SettingsSection title="Metadata" id="metadata" showTitle={false}>
					<CollectionMetadataEditor
						collection={collection}
						communityData={communityData}
						onUpdateCollection={updateCollection}
						allowUpdateDoi={depositTarget?.service !== 'datacite'}
					/>
				</SettingsSection>,
			],
		},
		collection.kind !== 'tag' && {
			id: 'contributors',
			title: 'Contributors',
			pubPubIcon: 'contributor',
			hideSaveButton: true,
			sections: [
				<SettingsSection title="Attribution" id="attribution" showTitle={false}>
					<CollectionAttributionEditor
						canEdit
						attributions={collectionAttributions!}
						onUpdateAttributions={setCollectionAttributions}
						collectionId={collection.id}
						communityId={communityData.id}
					/>
				</SettingsSection>,
			],
		},
		collection.kind !== 'tag' && {
			id: 'pub-settings',
			title: 'Pub settings',
			pubPubIcon: 'pub',
			sections: [<CommunityOrCollectionLevelPubSettings />],
		},
		collection.kind !== 'tag' &&
			depositTarget?.service === 'datacite' && {
				id: 'doi',
				title: 'DOI',
				icon: 'barcode',
				sections: [
					<Deposit
						depositTarget={depositTarget}
						canIssueDoi
						collection={collection}
						communityData={communityData}
						updateCollection={() => {}}
					/>,
				],
			},
	]);

	return (
		<DashboardSettingsFrame
			id="collection-settings"
			className="collection-settings-component"
			tabs={tabs}
			hasChanges={hasChanges}
			persist={persistCollection}
		/>
	);
};

export default CollectionSettings;

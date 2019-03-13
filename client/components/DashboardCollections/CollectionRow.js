import * as React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, EditableText, Button, ControlGroup } from '@blueprintjs/core';

import pubType from 'types/pub';
import collectionType from 'types/collection';
import communityType from 'types/community';
import { getSchemaForKind } from 'shared/collections/schemas';
import CollectionMetadataDialog from '../CollectionMetadata/CollectionMetadataDialog';
import CollectionEditorDialog from '../CollectionEditor/CollectionEditorDialog';

import LinkedPageSelect from './LinkedPageSelect';

const propTypes = {
	collection: collectionType.isRequired,
	communityData: communityType.isRequired,
	pubsData: PropTypes.arrayOf(pubType).isRequired,
	onCollectionDelete: PropTypes.func.isRequired,
	onCollectionUpdate: PropTypes.func.isRequired,
};

const CollectionRow = ({
	communityData,
	pubsData,
	collection,
	onCollectionUpdate,
	onCollectionDelete,
}) => {
	const schema = getSchemaForKind(collection.kind);
	const canEditMetadata = schema.metadata.length > 0;
	return (
		<div key={`collection-${collection.id}`} className="collection-wrapper">
			<div className="title">
				<EditableText
					defaultValue={collection.title}
					onConfirm={(newTitle) => {
						onCollectionUpdate({
							title: newTitle,
							collectionId: collection.id,
						});
					}}
				/>
			</div>
			<ControlGroup>
				<LinkedPageSelect
					collection={collection}
					onCollectionUpdate={onCollectionDelete}
					communityData={communityData}
				/>
				{canEditMetadata && (
					<CollectionEditorDialog
						collection={collection}
						pubs={pubsData}
						communityId={communityData.id}
					>
						{(openDialog, isLoading) => (
							<Button
								minimal
								text="Contents"
								icon="edit"
								onClick={openDialog}
								loading={isLoading}
							/>
						)}
					</CollectionEditorDialog>
				)}
				{canEditMetadata && (
					<CollectionMetadataDialog
						collection={collection}
						communityData={communityData}
						onRequestDoi={() => {}}
					>
						{(openDialog) => (
							<Button minimal text="Metadata" icon="link" onClick={openDialog} />
						)}
					</CollectionMetadataDialog>
				)}
			</ControlGroup>
			<Checkbox
				checked={!collection.isPublic}
				onChange={(evt) => {
					onCollectionUpdate({
						isPublic: !evt.target.checked,
						collectionId: collection.id,
					});
				}}
			>
				Private
			</Checkbox>
			<button
				type="button"
				className="bp3-button bp3-icon-small-cross bp3-minimal"
				onClick={() => {
					onCollectionDelete(collection.id);
				}}
			/>
		</div>
	);
};

CollectionRow.propTypes = propTypes;
export default CollectionRow;

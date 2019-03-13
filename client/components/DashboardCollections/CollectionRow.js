import * as React from 'react';
import { Checkbox, EditableText, Button, ControlGroup } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import fuzzysearch from 'fuzzysearch';
import { getSchemaForKind } from 'shared/collections/schemas';
import CollectionMetadataDialog from '../CollectionMetadata/CollectionMetadataDialog';
import CollectionEditorDialog from '../CollectionEditor/CollectionEditorDialog';

const LinkedPageSelect = ({ communityData, collection, onCollectionUpdate }) => (
	<Select
		items={communityData.pages}
		itemRenderer={(item, { handleClick, modifiers }) => {
			return (
				<button
					key={item.title}
					type="button"
					tabIndex={-1}
					onClick={handleClick}
					className={modifiers.active ? 'bp3-menu-item bp3-active' : 'bp3-menu-item'}
				>
					{item.title}
				</button>
			);
		}}
		itemListPredicate={(query, items) => {
			return items.filter((item) => {
				return fuzzysearch(query.toLowerCase(), item.title.toLowerCase());
			});
		}}
		onItemSelect={(item) => {
			onCollectionUpdate({
				pageId: item.id,
				collectionId: collection.id,
			});
		}}
		popoverProps={{ popoverClassName: 'bp3-minimal' }}
	>
		<Button
			minimal
			text={collection.page ? `Linked to: ${collection.page.title}` : 'Link to Page'}
			rightIcon="caret-down"
		/>
	</Select>
);

export default ({
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

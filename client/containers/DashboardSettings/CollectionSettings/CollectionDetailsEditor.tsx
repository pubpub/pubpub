/**
 * Dashboard collection tab pane that holds some miscellaneous options for collections
 */
import React from 'react';
import { Checkbox, FormGroup, Button, MenuItem } from '@blueprintjs/core';

import { getSchemaForKind } from 'utils/collections/schemas';
import { Collection } from 'utils/types';
import { ConfirmDialog, InputField } from 'components';
import { Select } from '@blueprintjs/select';

type Props = {
	collection: Collection;
	onDeleteCollection: () => unknown;
	onUpdateCollection: (update: Partial<Collection>) => unknown;
};

const readNextLabels = {
	none: 'Never show "Read Next"',
	minimal: 'Use compact preview with no image',
	medium: 'Use a larger preview with an image',
	'choose-best': 'Choose the best preview for each Pub',
};

const CollectionDetailsEditor = (props: Props) => {
	const { collection, onUpdateCollection, onDeleteCollection } = props;
	// @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
	const collectionLabel = getSchemaForKind(collection.kind).label.singular;
	return (
		<div>
			<InputField
				label="Title"
				placeholder="title"
				isRequired={true}
				defaultValue={props.collection.title}
				onBlur={(evt) => {
					if (evt.target.value) {
						onUpdateCollection({ title: evt.target.value });
					}
				}}
			/>
			<FormGroup
				helperText={
					`Making this ${collectionLabel} private means that team members will see it` +
					" but visitors won't know it exists."
				}
			>
				<Checkbox
					checked={!collection.isPublic}
					onChange={(evt) => {
						onUpdateCollection({ isPublic: !(evt.target as any).checked });
					}}
				>
					Private
				</Checkbox>
			</FormGroup>
			<FormGroup
				helperText={`You can choose how the "Read Next" Pub preview will appear to readers in this collection.`}
			>
				<Select<Collection['readNextPreviewSize']>
					popoverProps={{ minimal: true }}
					items={['none', 'choose-best']}
					itemRenderer={(item, { handleClick }) => {
						const isSelected = item === collection.readNextPreviewSize;
						return (
							<MenuItem
								onClick={handleClick}
								key={item}
								text={readNextLabels[item]}
								icon={isSelected ? 'tick' : 'blank'}
							/>
						);
					}}
					onItemSelect={(size) => onUpdateCollection({ readNextPreviewSize: size })}
					filterable={false}
				>
					<Button rightIcon="chevron-down">
						{readNextLabels[collection.readNextPreviewSize]}
					</Button>
				</Select>
			</FormGroup>
			<FormGroup helperText={`You can delete this ${collectionLabel} permanently.`}>
				<ConfirmDialog
					onConfirm={onDeleteCollection}
					confirmLabel="Delete"
					text={`Are you sure you want to delete this ${collectionLabel}?`}
				>
					{({ open }) => (
						<Button icon="trash" intent="danger" onClick={open}>
							Delete
						</Button>
					)}
				</ConfirmDialog>
			</FormGroup>
		</div>
	);
};
export default CollectionDetailsEditor;

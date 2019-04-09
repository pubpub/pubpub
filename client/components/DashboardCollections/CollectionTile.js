import * as React from 'react';
import PropTypes from 'prop-types';
import geopattern from 'geopattern';
import { Checkbox, Card, Icon } from '@blueprintjs/core';

import collectionType from 'types/collection';
import communityType from 'types/community';
import { getSchemaForKind } from 'shared/collections/schemas';

import LinkedPageSelect from './LinkedPageSelect';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const propTypes = {
	collection: collectionType.isRequired,
	communityData: communityType.isRequired,
	onDeleteCollection: PropTypes.func.isRequired,
	onUpdateCollection: PropTypes.func.isRequired,
};

const CollectionRow = ({ communityData, collection, onUpdateCollection, onDeleteCollection }) => {
	const schema = getSchemaForKind(collection.kind);
	const label = schema.label.singular;
	return (
		<Card key={`collection-${collection.id}`} elevation={1} className="collection-wrapper">
			<div
				className="binding"
				style={{
					background: geopattern
						.generate(collection.id, {
							color: communityData.accentColor,
						})
						.toDataUrl(),
				}}
			/>
			<div className="contents">
				<ConfirmDialog
					text={`Are you sure you want to delete this ${label}?`}
					confirmLabel="Delete"
					onConfirm={() => {
						onDeleteCollection(collection.id);
					}}
				>
					{({ open }) => (
						<button
							type="button"
							className="bp3-button bp3-icon-small-cross bp3-minimal delete-button"
							onClick={open}
						/>
					)}
				</ConfirmDialog>
				<div className="title">
					<div className="kind-container">
						<div className="kind-label">
							<Icon iconSize={10} icon={schema.bpDisplayIcon} />
							{capitalize(schema.label.singular)}
						</div>
					</div>
					{collection.title}
				</div>
				<div className="controls">
					<Checkbox
						checked={!collection.isPublic}
						onChange={(evt) => {
							onUpdateCollection({
								isPublic: !evt.target.checked,
								id: collection.id,
							});
						}}
					>
						Private
					</Checkbox>
					<LinkedPageSelect
						collection={collection}
						onSelectPage={(pageId) =>
							onUpdateCollection({
								id: collection.id,
								pageId: pageId,
							})
						}
						communityData={communityData}
						minimal={true}
					/>
				</div>
			</div>
		</Card>
	);
};

CollectionRow.propTypes = propTypes;
export default CollectionRow;

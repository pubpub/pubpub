import * as React from 'react';
import PropTypes from 'prop-types';
import geopattern from 'geopattern';
import { Button, Checkbox, Card, Icon } from '@blueprintjs/core';

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
		<Card key={`collection-${collection.id}`} elevation={1} className="collection-tile">
			<div className="inner">
				<div
					className="binding"
					style={{
						background: geopattern
							.generate(collection.id, {
								color: communityData.accentColor,
							})
							.toDataUrl(),
					}}
				>
				</div>
				<div className="contents">
					<a href={`/dashboard/collections/${collection.id}`} className="title">
						{collection.title}
					</a>
					<div className="info-container">
						<div className="info-label">
							<Icon iconSize={10} icon={schema.bpDisplayIcon} />
							{capitalize(schema.label.singular)}
						</div>
						<div className="info-label">
							<Icon iconSize={10} icon={collection.isPrivate ? 'lock' : 'unlock'} />
							{collection.isPrivate ? 'Private' : 'Public'}
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
};

CollectionRow.propTypes = propTypes;
export default CollectionRow;
